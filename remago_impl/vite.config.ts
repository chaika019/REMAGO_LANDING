import { defineConfig } from 'vite'
import { externalRtvMedia } from './scripts/rtv-vite-plugin.mjs'
import react from '@vitejs/plugin-react'
import assets from './src/data/optimized-assets.json'
import heroes from './src/data/hero-assets.json'

const heroPreloads: Record<string, { href: string; srcSet?: string }> = {}
for (const route of Object.keys(heroes)) {
  const source = heroes[route as keyof typeof heroes]
  const asset = assets[source as keyof typeof assets]
  heroPreloads[route] = { href: asset.src, srcSet: 'srcSet' in asset ? asset.srcSet : undefined }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), externalRtvMedia(mode), {
    name: 'preload-route-hero',
    transformIndexHtml() {
      return [{ tag: 'script', injectTo: 'head', children: `(()=>{const heroes=${JSON.stringify(heroPreloads).replace(/</g, '\\u003c')};const hero=heroes[location.pathname.replace(/\\/$/,'')||'/'];if(!hero)return;const link=document.createElement('link');link.rel='preload';link.as='image';link.fetchPriority='high';link.href=hero.href;if(hero.srcSet){link.imageSrcset=hero.srcSet;link.imageSizes='(max-width: 900px) 100vw, 50vw'}document.head.append(link)})()` }]
    },
  }],
  server: { port: 5173, host: '0.0.0.0' },
}))
