import { test } from 'node:test'
import assert from 'node:assert/strict'
import { encodingArguments, encodingProfiles } from './lib/rtv-media.mjs'

test('phone and desktop preserve portrait orientation without stretching', () => {
  const stream = { width: 1080, height: 1920, avg_frame_rate: '25/1' }
  const mobile = encodingArguments(stream, encodingProfiles.mobile)
  const desktop = encodingArguments(stream, encodingProfiles.desktop)
  assert.match(mobile[mobile.indexOf('-vf') + 1], /min\(iw,540\).*min\(ih,960\).*force_original_aspect_ratio=decrease/)
  assert.match(desktop[desktop.indexOf('-vf') + 1], /min\(iw,1080\).*min\(ih,1920\)/)
  assert.match(mobile[mobile.indexOf('-vf') + 1], /fps=25$/)
})

test('large landscape clips are bounded, small clips are never upscaled, and 60fps is capped', () => {
  const args = encodingArguments({ width: 3840, height: 2160, avg_frame_rate: '60/1' }, encodingProfiles.desktop)
  assert.match(args[args.indexOf('-vf') + 1], /min\(iw,1920\).*min\(ih,1080\).*fps=30$/)
  assert(args.includes('+faststart'))
  assert(args.includes('yuv420p'))
  assert(args.includes('0:a:0?'))
  assert.equal(args[args.indexOf('-c:a') + 1], 'aac')
})

test('phone rotation metadata chooses portrait bounds after autorotation', () => {
  const args = encodingArguments({ width: 1920, height: 1080, avg_frame_rate: '30/1', side_data_list: [{ rotation: -90 }] }, encodingProfiles.mobile)
  assert.match(args[args.indexOf('-vf') + 1], /min\(iw,540\).*min\(ih,960\)/)
})
