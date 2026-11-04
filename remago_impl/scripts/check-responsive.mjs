import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { preview } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const routes = ['/', '/partners', '/products', '/rtv', '/services', '/services/advertising', '/contacts', '/faq', '/missing']
const sizes = [320, 360, 390, 430, 600, 768, 820, 900, 1024, 1100, 1200, 1280, 1440, 1600, 1920]
  .map(width => ({ width, height: width <= 600 ? 844 : 900 }))
sizes.push({ width: 844, height: 390 })
const directory = new URL('../reports/responsive/', import.meta.url)
mkdirSync(directory, { recursive: true })
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const result = { status: 'running', sizes, routes, checks: [], reason: null,
  methodology: 'Production Chromium layout checks; horizontal overflow, off-screen controls, menus and four contact forms. Screenshots at 320/768/1440px. No forms submitted. Not a physical-device or cross-browser test.' }
let server, browser

async function getChromium() {
  for (const module of ['playwright', 'playwright-core', '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright-core/index.mjs']) {
    try { return (await import(module.startsWith('/') ? pathToFileURL(module).href : module)).chromium } catch {}
  }
  throw new Error('Playwright unavailable. Install Playwright and Chromium to run browser acceptance.')
}

// Serialized into the browser. Off-stage carousel slides and the skip link are intentional.
function layoutProblems() {
  const problems = []
  if (document.documentElement.scrollWidth > innerWidth + 1) problems.push(`Document overflows: ${document.documentElement.scrollWidth}px / ${innerWidth}px`)
  const dialog = document.querySelector('dialog[open]')
  const scope = dialog || document
  for (const element of scope.querySelectorAll('a, button, input, textarea, select, h1, h2, h3, .cta-card__img, .ad-location-photo')) {
    if (element.closest('[aria-hidden="true"], [inert], .visually-hidden, .skip-link, .design-carousel__slide--left, .design-carousel__slide--right')) continue
    const box = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    if (!box.width || !box.height || style.visibility === 'hidden') continue
    if (box.left < -1 || box.right > innerWidth + 1) problems.push(`${element.tagName}.${element.className}: outside viewport (${Math.round(box.left)}–${Math.round(box.right)})`)
    if (/^H[123]$/.test(element.tagName) && element.scrollHeight > element.clientHeight + 8) problems.push(`${element.tagName}.${element.className}: heading exceeds its height`)
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName) && parseFloat(style.fontSize) < 16) problems.push(`${element.tagName}: field font smaller than 16px`)
  }
  if (!dialog) for (const card of document.querySelectorAll('.ad-location-card--live')) {
    if (card.closest('[inert]')) continue
    if (card.scrollHeight > card.clientHeight + 2) problems.push('Location card content exceeds its height')
    if (card.querySelector('.ad-location-photo')?.getBoundingClientRect().height < 100) problems.push('Location photograph is collapsed')
  }
  if (!dialog && innerWidth <= 600) {
    const widths = [...document.querySelectorAll('.channel-card')].map(card => card.getBoundingClientRect().width)
    if (widths.length && Math.max(...widths) - Math.min(...widths) > 2) problems.push('RTV mobile cards have inconsistent widths')
  }
  return [...new Set(problems)]
}

try {
  server = await preview({ root, preview: { host: '127.0.0.1', port: 4181, strictPort: true } })
  const chromium = await getChromium()
  const executablePath = process.env.REMAGO_CHROMIUM_PATH ?? (existsSync(chromium.executablePath()) ? chromium.executablePath() :
    existsSync('/snap/chromium/current/usr/lib/chromium-browser/chrome') ? '/snap/chromium/current/usr/lib/chromium-browser/chrome' : undefined)
  browser = await chromium.launch({ headless: true, executablePath })
  for (const viewport of sizes) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: viewport.width <= 900 ? 2 : 1, isMobile: viewport.width <= 900, hasTouch: viewport.width <= 900, reducedMotion: 'reduce' })
    try {
      const page = await context.newPage()
      for (const route of routes) {
        const errors = []
        const onError = error => errors.push(String(error))
        page.on('pageerror', onError)
        try {
          await page.goto(`http://127.0.0.1:4181${route}`, { waitUntil: 'load', timeout: 30000 })
          await page.evaluate(async () => { await document.fonts.ready })
          await page.locator('main h1').waitFor({ state: 'attached' })
          const problems = await page.evaluate(layoutProblems)
          const menu = page.locator('.menu-button')
          if (viewport.width <= 1200) {
            await menu.click()
            await page.locator('.nav--open').waitFor({ state: 'visible' })
            problems.push(...await page.evaluate(layoutProblems))
            await page.keyboard.press('Escape')
            if (await menu.getAttribute('aria-expanded') !== 'false') problems.push('Menu did not close on Escape')
          } else if (await menu.isVisible()) problems.push('Mobile menu is visible on desktop')
          if (route === '/rtv') {
            // Layout acceptance only: avoid downloading the large original videos.
            await page.route('**/*.mp4', request => request.abort())
            await page.locator('.rtv-hero-video').click()
            await page.locator('.rtv-hero-stage .led-board-frame').waitFor()
            if (await page.locator('dialog[open]').count()) problems.push('RTV hero opened a modal')
            problems.push(...await page.evaluate(layoutProblems))
            await page.locator('.led-player__close').click()
            const front = page.locator('.rtv-channel-front').first()
            if (viewport.width <= 900) await front.tap()
            else await front.hover()
            await page.locator('.rtv-channel-back .led-board-frame').waitFor()
            if (await page.locator('dialog[open]').count()) problems.push('RTV channel opened a modal')
            const frame = await page.locator('.rtv-channel-back .led-board-frame').boundingBox()
            if (!frame || frame.width < 40 || frame.height < 100) problems.push('Inline LED cabinet has collapsed')
            problems.push(...await page.evaluate(layoutProblems))
            await page.locator('.led-player__close').click()
            await page.unroute('**/*.mp4')
          }
          if (route === '/faq') {
            for (const button of await page.locator('.faq-item > button').all()) await button.click()
            problems.push(...await page.evaluate(layoutProblems))
          }
          if (route === '/products') {
            await page.locator('.product-hero-next').click()
            await page.waitForFunction(() => document.querySelector('.product-hero-visual [data-carousel-index]')?.getAttribute('data-carousel-index') === '1')
            problems.push(...await page.evaluate(layoutProblems))
          }
          if (route === '/services/advertising') {
            await page.getByRole('button', { name: 'Показать борд: д. Боровляны, ул. 40 лет Победы, 21А', exact: true }).click()
            await page.waitForFunction(() => document.querySelector('.ad-location-slider [data-carousel-index]')?.getAttribute('data-carousel-index') === '24')
            await page.locator('.ad-location-photo').evaluate(image => image.decode().catch(() => {}))
            problems.push(...await page.evaluate(layoutProblems))
          }
          if ([320, 768, 1440].includes(viewport.width)) {
            // Load lower images before full-page screenshots.
            await page.evaluate(async () => {
              const images = [...document.images]
              images.forEach(image => { image.loading = 'eager' })
              await Promise.all(images.map(image => image.decode().catch(() => {})))
            })
            const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')
            await page.screenshot({ path: fileURLToPath(new URL(`${viewport.width}-${name}.png`, directory)), fullPage: true })
          }
          if (route === '/') for (const kind of ['callback', 'support', 'rtv', 'proposal']) {
            await page.evaluate(kind => window.dispatchEvent(new Event(`remago:${kind}`)), kind)
            await page.locator('dialog[open]').waitFor()
            problems.push(...(await page.evaluate(layoutProblems)).map(problem => `${kind}: ${problem}`))
            if (kind === 'callback') {
              const mascot = await page.locator('.callback-form__mascot').evaluate(async image => {
                image.loading = 'eager'
                await image.decode().catch(() => {})
                const box = image.getBoundingClientRect()
                return { width: box.width, height: box.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight }
              })
              if (!mascot.naturalWidth || !mascot.height || Math.abs(mascot.width / mascot.height - mascot.naturalWidth / mascot.naturalHeight) > 0.02) problems.push('Callback mascot is stretched or failed to load')
            }
            await page.keyboard.press('Escape')
            await page.locator('dialog[open]').waitFor({ state: 'detached' })
          }
          result.checks.push({ viewport, route, problems: [...new Set(problems)], errors })
          console.log(`${viewport.width}×${viewport.height} ${route}: ${problems.length || errors.length ? 'FAIL' : 'OK'}`)
        } catch (error) {
          result.checks.push({ viewport, route, problems: [String(error)], errors })
        } finally { page.off('pageerror', onError) }
      }
    } finally { await context.close() }
  }
  result.status = result.checks.every(check => !check.problems.length && !check.errors.length) ? 'passed' : 'failed'
} catch (error) {
  result.status = 'unavailable'
  result.reason = String(error)
} finally {
  if (browser) await browser.close()
  if (server) await new Promise(resolve => server.httpServer.close(resolve))
  const output = new URL(`${stamp}.json`, directory)
  writeFileSync(output, JSON.stringify(result, null, 2) + '\n')
  console.log(`Responsive audit: ${result.status}. ${result.reason ?? ''}\n${fileURLToPath(output)}`)
  if (result.status !== 'passed') process.exitCode = 1
}
