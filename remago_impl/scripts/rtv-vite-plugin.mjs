import { loadEnv } from 'vite'
import { rm, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export function externalRtvMedia(mode) {
  const externalMedia = loadEnv(mode, process.cwd(), 'VITE_').VITE_RTV_MEDIA_BASE_URL
  return {
    name: 'external-rtv-media',
    async buildStart() {
      if (!externalMedia) return
      const media = JSON.parse(await readFile(new URL('../src/data/rtv-media.json', import.meta.url), 'utf8'))
      if (media.some(video => video.encoding === 'original')) {
        throw new Error('Run npm run media:prepare and npm run media:upload before building with external RTV storage')
      }
    },
    async writeBundle(options) {
      if (externalMedia && options.dir) await rm(resolve(options.dir, 'media/rtv'), { recursive: true, force: true })
    },
  }
}
