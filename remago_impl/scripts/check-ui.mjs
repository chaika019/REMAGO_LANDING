import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Offline structural audit. Browser geometry and interactions require separate acceptance.
const root = fileURLToPath(new URL('../', import.meta.url))
const routes = ['/', '/partners', '/products', '/rtv', '/services', '/services/advertising', '/contacts', '/faq', '/missing']
const temporary = mkdtempSync(join(tmpdir(), 'remago-ui-'))
try {
  const result = await build({
    stdin: {
      contents: `import React from 'react'
        import { renderToString } from 'react-dom/server'
        import { StaticRouter } from 'react-router-dom'
        import App from './src/App'
        export const render = route => renderToString(<StaticRouter location={route}><App /></StaticRouter>)`,
      resolveDir: root, loader: 'tsx',
    },
    tsconfig: join(root, 'tsconfig.app.json'),
    bundle: true, platform: 'node', format: 'cjs', write: false,
    loader: { '.css': 'empty' }, define: { 'import.meta.env': '{}' },
  })
  const bundle = join(temporary, 'render.cjs')
  writeFileSync(bundle, result.outputFiles[0].text)
  const { render } = createRequire(import.meta.url)(bundle)
  let images = 0, links = 0
  for (const route of routes) {
    const html = render(route)
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route}: main landmark`)
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: page heading`)
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])
    assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`)
    for (const [, href] of html.matchAll(/\shref="([^"]*)"/g)) {
      links++
      assert.ok(href && href !== '#', `${route}: empty link`)
      if (href.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `${route}: unresolved anchor ${href}`)
      if (href.startsWith('/') && !href.startsWith('/assets/')) assert.ok(routes.includes(href), `${route}: unknown route ${href}`)
    }
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      images++
      assert.match(tag, /\salt="[^"]*"/, `${route}: missing image description`)
      const source = tag.match(/\ssrc="([^"]+)"/)?.[1]
      assert.ok(source, `${route}: missing image source`)
      const sources = [source, ...(tag.match(/\ssrcSet="([^"]+)"/i)?.[1].split(',').map(item => item.trim().split(/\s+/)[0]) ?? [])]
      for (const source of sources) {
        if (source.startsWith('/assets/')) assert.ok(existsSync(resolve(root, 'public', source.slice(1))), `${route}: missing ${source}`)
      }
    }
    if (route === '/services/advertising') {
      assert.equal((html.match(/Показать борд:/g) ?? []).length, 25, 'All 25 locations remain selectable')
      assert.equal((html.match(/aria-current="true"/g) ?? []).length >= 1, true, 'Current location is announced')
    }
    if (route === '/rtv') {
      assert.equal((html.match(/class="channel-card /g) ?? []).length, 5, 'All five RTV channels remain present')
      assert.equal((html.match(/class="rtv-channel-front"/g) ?? []).length, 5, 'All channels use inline flip controls')
      assert.equal((html.match(/aria-haspopup="dialog"/g) ?? []).length, 0, 'RTV playback does not open dialogs')
      assert.equal((html.match(/<video\b/g) ?? []).length, 0, 'No video sources mount before interaction')
    }
    if (route === '/faq') assert.equal((html.match(/class="faq-item/g) ?? []).length, 7, 'All seven FAQ entries remain present')
    console.log(`${route}: heading, landmarks, IDs, local images and links OK`)
  }
  const manifest = JSON.parse(readFileSync(join(root, 'src/data/optimized-assets.json'), 'utf8'))
  for (const [source, asset] of Object.entries(manifest)) {
    assert.ok(asset.width > 0 && asset.height > 0, `${source}: invalid dimensions`)
    for (const url of [source, asset.src, ...(asset.srcSet?.split(',').map(item => item.trim().split(/\s+/)[0]) ?? [])]) {
      assert.ok(existsSync(resolve(root, 'public', url.slice(1))), `Manifest: missing ${url}`)
    }
  }
  console.log(`PASS: ${routes.length} routes; ${images} images; ${links} links; ${Object.keys(manifest).length} manifest entries. Browser acceptance remains required.`)
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
