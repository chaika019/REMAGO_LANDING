import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { selectProfiles, median, validRun, meetsBudget } from './performance-profiles.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const routes = ['/', '/partners', '/products', '/rtv', '/services', '/services/advertising', '/contacts', '/faq', '/missing']
const repetitions = Number(process.env.REMAGO_PERF_RUNS ?? 3)
if (!Number.isInteger(repetitions) || repetitions < 1 || repetitions > 10) throw new Error('REMAGO_PERF_RUNS must be 1–10')
const profiles = selectProfiles(process.env.REMAGO_PERF_PROFILES)
const base = 'http://127.0.0.1:4180'
const viewport = process.env.REMAGO_PERF_VIEWPORT === 'desktop' ? { width: 1440, height: 900 } : { width: 390, height: 844 }
const mobile = viewport.width < 900
const result = {
  schemaVersion: 2, startedAt: new Date().toISOString(), base, viewport, deviceScaleFactor: mobile ? 2 : 1,
  cpuSlowdown: 4, cache: 'cold navigation; enabled after first-screen snapshot', profiles, repetitions, routes, status: 'running', runs: [],
  methodology: 'First screen waits for visible images, fonts, and 2s quiet LCP/CLS. Then scroll, all slides, and all four contact dialogs are audited. Audit duration includes deliberate interaction and is not a page-load metric. Explicit synthetic networks; local preview is uncompressed and excludes real hosting/CDN/TTFB.',
}
const output = new URL('../reports/performance/', import.meta.url)
mkdirSync(output, { recursive: true })
const stamp = result.startedAt.replaceAll(':', '-').replaceAll('.', '-')
const jsonFile = new URL(`${stamp}.json`, output)
const markdownFile = new URL(`${stamp}.md`, output)
const save = () => writeFileSync(jsonFile, JSON.stringify(result, null, 2) + '\n')
let server, browser

async function playwright() {
  const modules = process.env.REMAGO_PLAYWRIGHT_MODULE ? [process.env.REMAGO_PLAYWRIGHT_MODULE] : [
    'playwright', 'playwright-core', '/usr/lib/chatgpt/resources/cua_node/lib/node_modules/playwright-core/index.mjs',
  ]
  for (const name of modules) {
    try { return await import(name.startsWith('/') ? pathToFileURL(name).href : name) } catch {}
  }
  throw new Error('Playwright unavailable. Install: npm install --save-dev playwright; npx playwright install chromium')
}

// This function is serialized into the browser by Playwright.
function installObservers() {
  const state = window.__remagoMetrics = { lcp: null, lcpElement: null, cls: 0, lastChange: 0, shifts: [], fontsReady: null }
  const observers = []
  const supported = PerformanceObserver.supportedEntryTypes
  if (supported.includes('largest-contentful-paint')) {
    const observer = new PerformanceObserver(list => {
      const entry = list.getEntries().at(-1)
      state.lcp = entry.startTime
      state.lcpElement = entry.url || entry.element?.className || entry.element?.tagName || null
      state.lastChange = performance.now()
    })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
    observers.push(observer)
  }
  let session = 0, start = 0, last = 0
  if (supported.includes('layout-shift')) {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue
        if (entry.startTime - last < 1000 && entry.startTime - start < 5000) session += entry.value
        else { session = entry.value; start = entry.startTime }
        last = entry.startTime
        state.cls = Math.max(state.cls, session)
        state.lastChange = performance.now()
        if (state.shifts.length < 100) state.shifts.push({ time: entry.startTime, value: entry.value,
          sources: entry.sources.map(source => ({ node: source.node?.className || source.node?.nodeName,
            previous: source.previousRect.toJSON(), current: source.currentRect.toJSON() })) })
      }
    })
    observer.observe({ type: 'layout-shift', buffered: true })
    observers.push(observer)
  }
  window.__stopRemagoObservers = () => observers.forEach(observer => observer.disconnect())
}

async function auditImages(page, timeoutMs) {
  const seen = new Map()
  const backgrounds = new Set()
  const problems = []
  const phases = []
  const collect = async label => {
    const images = await page.evaluate(() => [...document.images].map(image => ({
      url: image.currentSrc || image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight,
      complete: image.complete, element: image.className,
    })))
    for (const image of images) {
      if (!image.url) { problems.push({ phase: label, reason: 'Image has no source', ...image }); continue }
      const previous = seen.get(image.url)
      seen.set(image.url, { ...image, phases: [...new Set([...(previous?.phases ?? []), label])] })
      if (!image.complete || !image.width) problems.push({ phase: label, reason: image.complete ? 'Broken image' : 'Pending image', ...image })
    }
    const urls = await page.evaluate(() => {
      const urls = new Set()
      for (const element of document.querySelectorAll('*')) {
        for (const pseudo of [null, '::before', '::after']) {
          const background = getComputedStyle(element, pseudo).backgroundImage
          for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) urls.add(new URL(match[1], location.href).href)
        }
      }
      return [...urls]
    })
    for (const url of urls) backgrounds.add(url)
    phases.push({ label, time: await page.evaluate(() => performance.now()), images: images.length })
  }
  const settle = async label => {
    // Force every mounted lazy image after first-screen metrics are frozen.
    await page.evaluate(() => { for (const image of document.images) image.loading = 'eager' })
    await page.waitForFunction(() => [...document.images].every(image => image.complete), null, { timeout: timeoutMs })
    await page.evaluate(async () => {
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})))
    })
    await collect(label)
  }
  let staticImagesReady = null
  try {
    for (let y = 0, step = 0; step < 120; step++) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y)
      await page.waitForTimeout(150)
      const height = await page.evaluate(() => document.documentElement.scrollHeight)
      if (y + viewport.height >= height) break
      y += Math.round(viewport.height * 0.8)
      if (step === 119) throw new Error('Scroll coverage limit exceeded')
    }
    const map = page.locator('[data-map-state]')
    if (await map.count()) {
      await page.waitForFunction(() => ['ready', 'error'].includes(document.querySelector('[data-map-state]')?.dataset.mapState), null, { timeout: timeoutMs })
      if (await map.getAttribute('data-map-state') === 'error') throw new Error('Map module failed to load')
    }
    await settle('full-page')
    staticImagesReady = await page.evaluate(() => performance.now())
    const carousels = page.locator('[data-carousel-count]')
    for (let carousel = 0; carousel < await carousels.count(); carousel++) {
      const element = carousels.nth(carousel)
      const count = Number(await element.getAttribute('data-carousel-count'))
      await element.scrollIntoViewIfNeeded()
      for (let slide = 0; slide < count; slide++) {
        const dots = element.locator('.design-carousel__dots button')
        if (await dots.count()) await dots.nth(slide).click()
        else if (slide > 0) {
          const next = page.locator('.product-hero-next:visible, .ad-location-slider__next:visible')
          if (await next.count() !== 1) throw new Error('Cannot identify carousel next button')
          await next.click()
        }
        await page.waitForFunction(({ carousel, slide }) => {
          const node = document.querySelectorAll('[data-carousel-count]')[carousel]
          return Number(node?.getAttribute('data-carousel-index')) === slide &&
            !node.querySelector('.carousel-motion__layer--outgoing, .design-carousel__layer--outgoing')
        }, { carousel, slide }, { timeout: timeoutMs })
        await settle(`carousel-${carousel}-slide-${slide}`)
      }
    }
    for (const kind of ['callback', 'support', 'rtv', 'proposal']) {
      await page.evaluate(kind => window.dispatchEvent(new Event(`remago:${kind}`)), kind)
      await page.locator('dialog[open]').waitFor({ timeout: 5000 })
      await settle(`dialog-${kind}`)
      await page.evaluate(() => document.querySelector('dialog[open]').close())
      await page.locator('dialog[open]').waitFor({ state: 'detached', timeout: 5000 })
    }
    // Verify CSS images with decode, including deferred backgrounds and pseudo-elements.
    for (const url of backgrounds) {
      const decoded = await page.evaluate(({ url, timeoutMs }) => new Promise(resolve => {
        const image = new Image()
        const timer = setTimeout(() => resolve({ ok: false, reason: 'CSS image timeout' }), timeoutMs)
        image.onload = async () => {
          try { await image.decode(); resolve({ ok: true, width: image.naturalWidth, height: image.naturalHeight }) }
          catch { resolve({ ok: false, reason: 'CSS image decode failed' }) }
          finally { clearTimeout(timer) }
        }
        image.onerror = () => { clearTimeout(timer); resolve({ ok: false, reason: 'CSS image failed' }) }
        image.src = url
      }), { url, timeoutMs })
      if (!decoded.ok) problems.push({ phase: 'css-backgrounds', url, ...decoded })
    }
    return { complete: true, staticImagesReady, finishedAt: await page.evaluate(() => performance.now()),
      map: await page.locator('[data-map-state]').count() ? { state: await page.locator('[data-map-state]').getAttribute('data-map-state'), markers: await page.locator('.ad-pin-wrap').count() } : null,
      imageCount: seen.size, backgroundCount: backgrounds.size, images: [...seen.values()], backgrounds: [...backgrounds], problems, phases }
  } catch (error) {
    await collect('interrupted').catch(() => {})
    return { complete: false, staticImagesReady, imageCount: seen.size, backgroundCount: backgrounds.size,
      images: [...seen.values()], backgrounds: [...backgrounds], problems: [...problems, { reason: String(error) }], phases }
  }
}

try {
  let serverLog = '', serverError
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4180', '--strictPort'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })
  for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { serverLog = (serverLog + data).slice(-4000) })
  server.on('error', error => { serverError = error })
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    if (serverError || server.exitCode !== null) {
      await delay(100)
      throw new Error(`Preview unavailable (exit ${server.exitCode}, signal ${server.signalCode}): ${serverError ?? serverLog}`)
    }
    if (!serverLog.includes(base)) { await delay(250); continue }
    try {
      const response = await fetch(base, { signal: AbortSignal.timeout(500) })
      if (response.ok && (await response.text()).includes('/assets/index-')) { ready = true; break }
    } catch {}
    await delay(250)
  }
  if (!ready) throw new Error(`Production preview did not start. ${serverLog}`)
  const { chromium } = await playwright()
  const executablePath = process.env.REMAGO_CHROMIUM_PATH ?? (existsSync(chromium.executablePath()) ? chromium.executablePath() :
    existsSync('/snap/chromium/current/usr/lib/chromium-browser/chrome') ? '/snap/chromium/current/usr/lib/chromium-browser/chrome' : undefined)
  browser = await chromium.launch({ headless: true, executablePath, timeout: 15000 })
  result.browser = browser.version()
  for (const profile of profiles) for (const route of routes) for (let run = 1; run <= repetitions; run++) {
    console.log(`${profile.name} ${route} ${run}/${repetitions}: measuring first screen…`)
    const context = await browser.newContext({ viewport, deviceScaleFactor: result.deviceScaleFactor, isMobile: mobile, hasTouch: mobile, serviceWorkers: 'block' })
    try {
      const page = await context.newPage()
      const errors = [], cancellations = [], resources = []
      page.on('pageerror', error => errors.push(String(error)))
      page.on('requestfailed', request => {
        const failure = `${request.url()}: ${request.failure()?.errorText}`
        if (request.failure()?.errorText?.includes('ERR_ABORTED')) cancellations.push(failure)
        else errors.push(failure)
      })
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
      const cdp = await context.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false, latency: profile.latencyMs, downloadThroughput: profile.downloadMbps * 1e6 / 8,
        uploadThroughput: profile.uploadMbps * 1e6 / 8,
        connectionType: profile.id === '2g' ? 'cellular2g' : profile.id === '3g' ? 'cellular3g' : 'cellular4g',
      })
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: result.cpuSlowdown })
      let completedTransferBytes = 0
      const requests = new Map()
      cdp.on('Network.requestWillBeSent', event => requests.set(event.requestId, { url: event.request.url, type: event.type, start: event.timestamp }))
      cdp.on('Network.responseReceived', event => {
        const request = requests.get(event.requestId)
        if (request) Object.assign(request, { status: event.response.status, mimeType: event.response.mimeType })
      })
      cdp.on('Network.loadingFinished', event => {
        completedTransferBytes += event.encodedDataLength
        const request = requests.get(event.requestId)
        if (request) resources.push({ ...request, bytes: event.encodedDataLength, durationMs: (event.timestamp - request.start) * 1000 })
        requests.delete(event.requestId)
      })
      cdp.on('Network.loadingFailed', event => requests.delete(event.requestId))
      await page.addInitScript(installObservers)
      let navigationError, firstScreenImagesReady = null
      try {
        await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: profile.timeoutMs })
        await page.waitForFunction(() => {
          const visible = [...document.images].filter(image => {
            const box = image.getBoundingClientRect()
            return box.width && box.height && box.top < innerHeight && box.bottom > 0 && box.left < innerWidth && box.right > 0
          })
          return document.querySelector('main')?.textContent.trim() && document.fonts.status === 'loaded' &&
            visible.every(image => image.complete && image.naturalWidth > 0)
        }, null, { timeout: profile.timeoutMs })
        await page.evaluate(async () => {
          await Promise.all([...document.images].filter(image => { const box = image.getBoundingClientRect(); return box.width && box.height && box.top < innerHeight && box.bottom > 0 })
            .map(image => image.decode().catch(() => {})))
        })
        firstScreenImagesReady = await page.evaluate(() => {
          window.__remagoMetrics.fontsReady = performance.now()
          return performance.now()
        })
        await page.waitForFunction(() => window.__remagoMetrics.lcp !== null && performance.now() - window.__remagoMetrics.lastChange >= 2000,
          null, { timeout: profile.timeoutMs })
      } catch (error) { navigationError = String(error) }
      const metrics = await page.evaluate(() => {
        window.__stopRemagoObservers?.()
        const navigation = performance.getEntriesByType('navigation')[0]
        return { ...window.__remagoMetrics, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
          domContentLoaded: navigation?.domContentLoadedEventEnd ?? null, load: navigation?.loadEventEnd || null, observationEnd: performance.now() }
      })
      const firstScreenTransferBytes = completedTransferBytes
      console.log(`${profile.name} ${route}: LCP ${metrics.lcp === null ? 'unavailable' : (metrics.lcp / 1000).toFixed(2) + 's'}; auditing all images/slides…`)
      // Cold navigation, then normal cache reuse during the interaction/image audit.
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: false })
      const imageAudit = await auditImages(page, profile.timeoutMs)
      result.runs.push({ profile: profile.id, route, run, ...metrics, firstScreenImagesReady, firstScreenTransferBytes,
        completedTransferBytes, imageAudit, resources, pendingRequests: [...requests.values()], errors, cancellations, navigationError })
      console.log(`${profile.name} ${route}: images ${imageAudit.imageCount}, CSS backgrounds ${imageAudit.backgroundCount}, problems ${imageAudit.problems.length}, errors ${errors.length}`)
    } catch (error) {
      result.runs.push({ profile: profile.id, route, run, failed: String(error) })
      console.error(`${profile.name} ${route}: ${error}`)
    } finally { await context.close() }
    save()
  }
  result.status = result.runs.length === profiles.length * routes.length * repetitions && result.runs.every(validRun) ? 'measured' : 'partial'
} catch (error) {
  result.status = result.runs.length ? 'partial' : 'unavailable'
  result.reason = String(error)
  console.error(result.reason)
} finally {
  if (browser) await browser.close()
  if (server && server.exitCode === null) server.kill('SIGTERM')
  result.finishedAt = new Date().toISOString()
  save()
  const lines = ['# Local production performance and full image audit', '', `Status: **${result.status}**`, '',
    `${viewport.width}×${viewport.height}, DPR ${result.deviceScaleFactor}; CPU 4×; cold navigation; normal cache for image audit. ${repetitions} runs per route/profile.`, '', result.methodology, '',
    'Targets: LCP ≤ 3 s; CLS ≤ 0.1. A measured result can still miss these targets. 2G is deliberately demanding; a 3-second result is not guaranteed.', '',
    'Images include mounted page images, every carousel slide, all four contact dialogs, and CSS backgrounds. JSON contains URLs, decode failures, phase coverage, completed requests/bytes and layout-shift sources. Unused source/reference files are not downloaded.', '']
  if (result.reason) lines.push('No complete browser test was obtained.', '', '```text', result.reason, '```', '')
  const seconds = values => { const value = median(values.filter(Number.isFinite)); return value === null ? '—' : (value / 1000).toFixed(2) }
  for (const profile of profiles) {
    lines.push(`## ${profile.name}`, '', `${profile.downloadMbps} Mbps down / ${profile.uploadMbps} Mbps up; RTT ${profile.latencyMs} ms.`, '',
      '| Route | Valid | LCP s | FCP s | CLS | First-screen images s | Full-page images s* | Image/CSS URLs | Targets met |',
      '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |')
    for (const route of routes) {
      const runs = result.runs.filter(run => run.profile === profile.id && run.route === route)
      const valid = runs.filter(validRun)
      const cls = median(valid.map(run => run.cls))
      lines.push(`| ${route} | ${valid.length}/${repetitions} | ${seconds(valid.map(run => run.lcp))} | ${seconds(valid.map(run => run.fcp))} | ${cls === null ? '—' : cls.toFixed(3)} | ${seconds(valid.map(run => run.firstScreenImagesReady))} | ${seconds(valid.map(run => run.imageAudit.staticImagesReady))} | ${valid.length ? Math.max(...valid.map(run => run.imageAudit.imageCount + run.imageAudit.backgroundCount)) : '—'} | ${valid.length === repetitions ? valid.every(meetsBudget) ? 'yes' : 'no' : 'unverified'} |`)
    }
    lines.push('', '*Full-page time includes scripted scrolling after the initial measurement; carousel/dialog coverage is recorded separately in JSON.', '')
  }
  const failures = result.runs.filter(run => !validRun(run))
  if (failures.length) {
    lines.push('## Incomplete runs / image failures', '')
    for (const run of failures) lines.push(`- ${run.profile} ${run.route} #${run.run}: ${JSON.stringify({ failed: run.failed, navigationError: run.navigationError, errors: run.errors, problems: run.imageAudit?.problems })}`)
    lines.push('')
  }
  lines.push('Method references: [LCP](https://web.dev/articles/lcp), [CLS](https://web.dev/articles/cls), [custom DevTools throttling](https://developer.chrome.com/docs/devtools/network/reference).', '')
  writeFileSync(markdownFile, lines.join('\n') + '\n')
  console.log(`Reports: ${fileURLToPath(markdownFile)} and ${fileURLToPath(jsonFile)}`)
  if (result.status !== 'measured' || !result.runs.every(meetsBudget)) process.exitCode = 1
}
