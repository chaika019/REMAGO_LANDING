import manifest from './rtv-media.json'

export type RtvChannel = 'marketing' | 'social' | 'gbc' | 'news' | 'entertainment' | 'hero'
export type VideoQuality = 'mobile' | 'desktop'
export type RtvVideo = {
  id: string
  channel: string
  title: string
  variants: { mobile?: string; desktop?: string }
  poster?: string
}

export const rtvVideos: readonly RtvVideo[] = manifest
const mediaBase = (import.meta.env.VITE_RTV_MEDIA_BASE_URL || '/media/rtv').replace(/\/$/, '')

export function mediaUrl(path: string) {
  return `${mediaBase}/${path}`
}

export function hasVideo(video: RtvVideo) {
  return Boolean(video.variants.mobile || video.variants.desktop)
}

export function channelVideos(channel: RtvChannel) {
  return rtvVideos.filter(video => video.channel === channel)
}

export function videoSource(video: RtvVideo, quality: VideoQuality) {
  const path = video.variants[quality] || video.variants.desktop || video.variants.mobile
  return path ? mediaUrl(path) : undefined
}
