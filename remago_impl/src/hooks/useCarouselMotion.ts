import { useEffect, useReducer, useState } from 'react'
import assets from '../data/optimized-assets.json' with { type: 'json' }

export const carouselDuration = 400

type MotionState = {
  current: number
  requested: number
  previous: number | null
  direction: number
  revision: number
}

type MotionAction =
  | { type: 'move'; direction: number }
  | { type: 'select'; index: number; count: number }
  | { type: 'start'; target: number; reduced: boolean }
  | { type: 'finish'; revision: number }

export const initialCarouselMotion: MotionState = {
  current: 0, requested: 0, previous: null, direction: 1, revision: 0,
}

export function carouselMotionReducer(state: MotionState, action: MotionAction): MotionState {
  switch (action.type) {
    case 'move':
      return { ...state, requested: state.requested + action.direction }
    case 'select': {
      if (action.count < 2) return state
      const selected = ((state.requested % action.count) + action.count) % action.count
      let distance = (action.index - selected + action.count) % action.count
      if (distance > action.count / 2) distance -= action.count
      return { ...state, requested: state.requested + distance }
    }
    case 'start':
      if (state.previous !== null || action.target !== state.requested || action.target === state.current) return state
      return {
        ...state, current: action.target,
        previous: action.reduced ? null : state.current,
        direction: Math.sign(action.target - state.current),
        revision: state.revision + 1,
      }
    case 'finish':
      return action.revision === state.revision ? { ...state, previous: null } : state
  }
}

const imageLoads = new Map<string, Promise<void>>()
const optimizedAssets: Record<string, { src: string; srcSet?: string; sizes?: string }> = assets

function prepareImage(src: string): Promise<void> {
  const asset = optimizedAssets[src]
  src = asset?.src ?? src
  const existing = imageLoads.get(src)
  if (existing) return existing
  const ready = new Promise<void>(resolve => {
    const image = new Image()
    image.decoding = 'async'
    image.fetchPriority = 'low'
    if (asset?.srcSet) {
      image.sizes = asset.sizes ?? '(max-width: 900px) 100vw, 50vw'
      image.srcset = asset.srcSet
    }
    image.onload = () => {
      void image.decode().catch(() => {}).then(() => resolve())
    }
    image.onerror = () => {
      imageLoads.delete(src)
      resolve()
    }
    image.src = src
  })
  imageLoads.set(src, ready)
  return ready
}

export function useCarouselMotion(count: number, getSources: (index: number) => readonly string[], preloadNearby = true) {
  const [state, dispatch] = useReducer(carouselMotionReducer, initialCarouselMotion)
  const [reduced, setReduced] = useState(false)
  const wrap = (index: number) => count ? ((index % count) + count) % count : 0
  const targetSources = JSON.stringify(count ? getSources(wrap(state.requested)) : [])
  const nearbySources = JSON.stringify(count ? [
    ...getSources(wrap(state.current - 1)),
    ...getSources(wrap(state.current)),
    ...getSources(wrap(state.current + 1)),
  ] : [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!preloadNearby) return
    const sources: string[] = JSON.parse(nearbySources)
    let cancelled = false
    let idle: number | undefined
    let timer: number | undefined
    const warm = () => {
      if (!cancelled) for (const src of new Set(sources)) void prepareImage(src)
    }
    const schedule = async () => {
      // Window load can precede React's hero images. Keep speculative requests behind them.
      const critical = [...document.querySelectorAll<HTMLImageElement>('img[fetchpriority="high"]')]
      await Promise.all(critical.map(image => image.decode().catch(() => {})))
      if (cancelled) return
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(warm)
      else timer = window.setTimeout(warm, 1000)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('load', schedule)
      if (idle !== undefined) window.cancelIdleCallback(idle)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [nearbySources, preloadNearby])

  useEffect(() => {
    if (count < 2 || state.previous !== null || state.requested === state.current) return
    let cancelled = false
    const sources: string[] = JSON.parse(targetSources)
    void Promise.all([...new Set(sources)].map(prepareImage)).then(() => {
      if (!cancelled) dispatch({
        type: 'start', target: state.requested,
        reduced: reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      })
    })
    return () => { cancelled = true }
  }, [count, state.current, state.previous, state.requested, targetSources, reduced])

  useEffect(() => {
    if (state.previous === null) return
    const timer = window.setTimeout(() => dispatch({ type: 'finish', revision: state.revision }), reduced ? 0 : carouselDuration)
    return () => window.clearTimeout(timer)
  }, [state.previous, state.revision, reduced])

  return {
    ...state,
    count,
    active: wrap(state.current),
    previousIndex: state.previous === null ? null : wrap(state.previous),
    move: (direction: number) => { if (count > 1) dispatch({ type: 'move', direction }) },
    select: (index: number) => dispatch({ type: 'select', index, count }),
    wrap,
  }
}
