import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'

export async function sha256File(file) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(file)) hash.update(chunk)
  return hash.digest('hex')
}

export const encodingProfiles = {
  desktop: { long: 1920, short: 1080, crf: 22, maxrate: '3500k', bufsize: '7000k', audio: '96k' },
  mobile: { long: 960, short: 540, crf: 24, maxrate: '1200k', bufsize: '2400k', audio: '64k' },
}

export function encodingArguments(stream, profile) {
  const rotation = Number(stream.side_data_list?.find(item => item.rotation !== undefined)?.rotation ?? stream.tags?.rotate ?? 0)
  const quarterTurn = Math.abs(rotation) % 180 === 90
  const portrait = quarterTurn ? stream.width > stream.height : stream.height > stream.width
  const width = portrait ? profile.short : profile.long
  const height = portrait ? profile.long : profile.short
  const [numerator, denominator] = (stream.avg_frame_rate || '30/1').split('/').map(Number)
  const fps = numerator / denominator
  const filters = `scale=w='min(iw,${width})':h='min(ih,${height})':force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos,setsar=1,fps=${Number.isFinite(fps) && fps > 0 ? Math.min(30, fps) : 30}`
  return ['-map', '0:v:0', '-map', '0:a:0?', '-vf', filters,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(profile.crf),
    '-maxrate', profile.maxrate, '-bufsize', profile.bufsize, '-pix_fmt', 'yuv420p',
    '-profile:v', 'high', '-tag:v', 'avc1', '-threads', '2',
    '-c:a', 'aac', '-b:a', profile.audio, '-ac', '2', '-ar', '48000',
    '-movflags', '+faststart', '-map_metadata', '-1', '-sn', '-dn', '-f', 'mp4']
}
