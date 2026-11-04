import assert from 'node:assert/strict'
import { readFile, stat, open } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const directory = resolve(root, 'public/media/rtv')
const catalog = JSON.parse(await readFile(new URL('./rtv-catalog.json', import.meta.url), 'utf8'))
const manifest = JSON.parse(await readFile(new URL('../src/data/rtv-media.json', import.meta.url), 'utf8'))
const remote = process.argv.includes('--remote')
const base = process.env.RTV_MEDIA_PUBLIC_URL?.replace(/\/$/, '')
const origin = process.env.RTV_SITE_ORIGIN
if (remote && (!base || !origin)) throw new Error('Set RTV_MEDIA_PUBLIC_URL and RTV_SITE_ORIGIN for remote checks')
assert.deepEqual(manifest.map(v => [v.id, v.channel, v.title]), catalog.map(v => [v.id, v.channel, v.title]))
assert.equal(new Set(manifest.map(v => v.id)).size, manifest.length)
let checked = 0
let originals = 0
for (const video of manifest) {
  const paths = [...new Set(Object.values(video.variants))]
  if (!paths.length) continue
  if (video.encoding === 'original') originals++
  for (const path of paths) {
    assert(!path.startsWith('/') && !path.split('/').includes('..'))
    const local = resolve(directory, path)
    assert(local.startsWith(directory + sep))
    assert((await stat(local)).size > 0)
    // Check the MP4 container and faststart, without loading the video into memory.
    const handle = await open(local, 'r')
    const boxes = []
    try {
      const size = (await handle.stat()).size
      let offset = 0
      const header = Buffer.alloc(16)
      while (offset + 8 <= size) {
        await handle.read(header, 0, 16, offset)
        let length = header.readUInt32BE(0)
        const type = header.toString('ascii', 4, 8)
        if (length === 1) length = Number(header.readBigUInt64BE(8))
        if (length === 0) length = size - offset
        assert(length >= 8 && offset + length <= size, `Invalid MP4 atom in ${path}`)
        boxes.push(type)
        offset += length
      }
      assert(boxes.includes('ftyp') && boxes.includes('moov') && boxes.includes('mdat'), `Invalid MP4: ${path}`)
      if (video.encoding === 'h264') assert(boxes.indexOf('moov') < boxes.indexOf('mdat'), `No faststart: ${path}`)
    } finally { await handle.close() }
    if (remote) {
      const url = `${base}/${path}`
      const response = await fetch(url, { headers: { Range: 'bytes=0-1', Origin: origin }, signal: AbortSignal.timeout(15000) })
      try {
        assert.equal(response.status, 206, `Range requests unsupported: ${url}`)
        assert.match(response.headers.get('content-type') || '', /^video\/mp4/)
        assert.match(response.headers.get('content-range') || '', /^bytes 0-1\//)
        assert([origin, '*'].includes(response.headers.get('access-control-allow-origin')), `CORS missing: ${url}`)
      } finally { await response.body?.cancel() }
    }
    checked++
  }
}
console.log(`Checked ${checked} MP4 files; playlist order and container structure passed. ${originals} videos use original files and still need compression.`)
if (process.argv.includes('--require-encoded')) assert.equal(originals, 0, 'Original files are not ready for production')
