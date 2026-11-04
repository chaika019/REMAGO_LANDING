import { spawnSync } from 'node:child_process'
import { readFile, writeFile, mkdir, copyFile, rename, stat, access, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { sha256File, encodingProfiles, encodingArguments } from './lib/rtv-media.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const input = resolve(process.env.RTV_INPUT_DIR || join(root, '../video'))
const output = join(root, 'public/media/rtv')
const manifestPath = join(root, 'src/data/rtv-media.json')
const previousManifest = await readFile(manifestPath, 'utf8').then(JSON.parse).catch(() => [])
const catalog = JSON.parse(await readFile(new URL('./rtv-catalog.json', import.meta.url), 'utf8'))
const stageOriginals = process.argv.includes('--stage-originals')
const ffmpeg = process.env.FFMPEG || 'ffmpeg'
const ffprobe = process.env.FFPROBE || 'ffprobe'
function run(command, args, capture = false) {
  const result = spawnSync(command, args, { stdio: capture ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'ignore', 'inherit'], encoding: 'utf8' })
  if (result.error || result.status !== 0) throw new Error(`${command}: ${result.error?.message || result.stderr || 'processing failed'}`)
  return result.stdout
}
async function exists(file) { try { await access(file); return true } catch { return false } }
if (!stageOriginals) {
  run(ffmpeg, ['-version'], true)
  run(ffprobe, ['-version'], true)
}
await mkdir(output, { recursive: true })
const manifest = []
const report = { mode: stageOriginals ? 'originals (NOT compressed)' : 'encoded', sourceBytes: 0, outputBytes: 0, videos: [], missing: [] }
// Preserve a previous valid manifest if encoding is interrupted. Each output is atomic and can be resumed.
for (const item of catalog) {
  const video = { id: item.id, channel: item.channel, title: item.title, variants: {} }
  const source = item.source && join(input, item.source)
  if (!source || !await exists(source)) {
    report.missing.push(item.title)
    manifest.push(video)
    continue
  }
  const sourceBytes = (await stat(source)).size
  const sourceHash = await sha256File(source)
  const version = createHash('sha256').update(sourceHash + JSON.stringify(encodingProfiles) + (stageOriginals ? 'original' : 'x264-slow-v1')).digest('hex').slice(0, 16)
  const directory = `${item.id}/${version}`
  await mkdir(join(output, directory), { recursive: true })
  let duration
  if (stageOriginals) {
    const path = `${directory}/original.mp4`
    if (!await exists(join(output, path))) await copyFile(source, join(output, path))
    video.variants = { desktop: path, mobile: path }
    video.encoding = 'original'
  } else {
    const probe = JSON.parse(run(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', source], true))
    const stream = probe.streams.find(s => s.codec_type === 'video')
    if (!stream) throw new Error(`No video stream: ${item.source}`)
    duration = Number(probe.format.duration)
    for (const [quality, profile] of Object.entries(encodingProfiles)) {
      const path = `${directory}/${quality}.mp4`
      const destination = join(output, path)
      if (!await exists(destination)) {
        const temporary = `${destination}.partial.mp4`
        console.log(`Encoding ${item.title}: ${quality}`)
        try {
          run(ffmpeg, ['-hide_banner', '-loglevel', 'warning', '-y', '-i', source, ...encodingArguments(stream, profile), temporary])
          const result = JSON.parse(run(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', temporary], true))
          const encoded = result.streams.find(s => s.codec_type === 'video')
          if (!encoded || encoded.codec_name !== 'h264' || Math.abs(Number(result.format.duration) - duration) > 0.5) throw new Error(`Invalid encoded video: ${path}`)
          await rename(temporary, destination)
        } catch (error) { await rm(temporary, { force: true }); throw error }
      }
      video.variants[quality] = path
    }
    video.poster = `${directory}/poster.jpg`
    if (!await exists(join(output, video.poster))) {
      const temporary = join(output, `${directory}/poster.partial.jpg`)
      run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(Math.min(1, duration / 2)), '-i', source, '-frames:v', '1', '-vf', 'scale=640:640:force_original_aspect_ratio=decrease', '-update', '1', temporary])
      await rename(temporary, join(output, video.poster))
    }
    video.encoding = 'h264'
    video.duration = duration
  }
  const paths = [...new Set([...Object.values(video.variants), ...(video.poster ? [video.poster] : [])])]
  const outputBytes = (await Promise.all(paths.map(async path => (await stat(join(output, path))).size))).reduce((a, b) => a + b, 0)
  report.sourceBytes += sourceBytes
  report.outputBytes += outputBytes
  report.videos.push({ id: item.id, sourceBytes, outputBytes, duration, encoding: video.encoding })
  manifest.push(video)
}
await writeFile(`${manifestPath}.tmp`, JSON.stringify(manifest, null, 2) + '\n')
await rename(`${manifestPath}.tmp`, manifestPath)
await mkdir(join(root, 'reports/video'), { recursive: true })
await writeFile(join(root, 'reports/video/encoding.json'), JSON.stringify(report, null, 2) + '\n')
if (!stageOriginals) {
  // Only remove this tool's staged originals after the replacement manifest is fully written.
  for (const old of previousManifest.filter(item => item.encoding === 'original')) {
    const replacement = manifest.find(item => item.id === old.id && item.encoding === 'h264')
    if (!replacement) continue
    for (const path of new Set(Object.values(old.variants))) {
      if (typeof path === 'string' && /^[a-z0-9-]+\/[a-f0-9]{16}\/original\.mp4$/.test(path)) await rm(join(output, path), { force: true })
    }
  }
}
console.log(JSON.stringify(report, null, 2))
