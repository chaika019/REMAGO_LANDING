import { readFile, stat } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve, sep } from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(await readFile(new URL('../src/data/rtv-media.json', import.meta.url), 'utf8'))
const bucket = process.env.RTV_S3_BUCKET
const region = process.env.AWS_REGION || 'us-east-1'
const endpoint = process.env.RTV_S3_ENDPOINT
const dryRun = process.argv.includes('--dry-run')
const configure = process.argv.includes('--configure')
const output = resolve(root, 'public/media/rtv')
const assets = new Set()
for (const video of manifest) {
  if (!Object.keys(video.variants).length) continue
  if (video.encoding !== 'h264') throw new Error(`First run npm run media:prepare: ${video.id} is not compressed. Original videos will not be uploaded.`)
  if (!video.variants.mobile || !video.variants.desktop) throw new Error(`Missing a video quality: ${video.id}`)
  Object.values(video.variants).forEach(path => assets.add(path))
  if (video.poster) assets.add(video.poster)
}
if (!assets.size) throw new Error('No prepared videos to upload')
for (const path of assets) {
  const local = resolve(output, path)
  if (!local.startsWith(output + sep)) throw new Error('Invalid media path')
  if (!(await stat(local)).size) throw new Error(`Empty file: ${path}`)
}
if (!bucket && !dryRun) throw new Error('Set RTV_S3_BUCKET (and AWS credentials through the environment or AWS profile)')
if (dryRun) {
  console.log(`Validated ${assets.size} compressed assets. Destination: s3://${bucket || '<RTV_S3_BUCKET>'}/rtv/`)
  process.exit(0)
}
function aws(args) {
  const result = spawnSync('aws', [...args, '--region', region, ...(endpoint ? ['--endpoint-url', endpoint] : [])], { stdio: 'inherit' })
  if (result.error || result.status !== 0) throw new Error(`AWS CLI failed (${result.error?.message || result.status})`)
}
// Bucket creation and credentials are managed by the hosting account. Only the rtv/ prefix is public.
if (configure) {
  const origins = (process.env.RTV_ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean)
  if (!origins.length || origins.includes('*')) throw new Error('Set RTV_ALLOWED_ORIGINS to the actual site origins, separated by commas')
  const temporary = await mkdtemp(resolve(tmpdir(), 'remago-rtv-s3-'))
  try {
    const cors = { CORSRules: [{ AllowedOrigins: origins, AllowedMethods: ['GET', 'HEAD'], AllowedHeaders: ['Range'], ExposeHeaders: ['Accept-Ranges', 'Content-Length', 'Content-Range', 'ETag'], MaxAgeSeconds: 3600 }] }
    const policy = { Version: '2012-10-17', Statement: [{ Sid: 'ReadPublishedRtvVideos', Effect: 'Allow', Principal: '*', Action: 's3:GetObject', Resource: `arn:aws:s3:::${bucket}/rtv/*` }] }
    await writeFile(resolve(temporary, 'cors.json'), JSON.stringify(cors))
    await writeFile(resolve(temporary, 'policy.json'), JSON.stringify(policy))
    aws(['s3api', 'put-bucket-cors', '--bucket', bucket, '--cors-configuration', `file://${temporary}/cors.json`])
    // Replaces a bucket policy; use a dedicated media bucket with this explicit --configure option.
    aws(['s3api', 'put-bucket-policy', '--bucket', bucket, '--policy', `file://${temporary}/policy.json`])
  } finally { await rm(temporary, { recursive: true, force: true }) }
}
for (const path of assets) {
  aws(['s3', 'cp', resolve(output, path), `s3://${bucket}/rtv/${path}`, '--only-show-errors', '--content-type', path.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg', '--cache-control', 'public,max-age=31536000,immutable'])
}
console.log(`Uploaded ${assets.size} assets. Set VITE_RTV_MEDIA_BASE_URL to your public HTTPS bucket/CDN URL ending in /rtv and rebuild.`)
