import { useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './Icon'
import { carouselDuration, useCarouselMotion } from '../hooks/useCarouselMotion'
import { useNearViewport } from '../hooks/useNearViewport'
import '../styles/carousel-motion.css'

type CarouselProps<T> = {
  items: readonly T[]
  label: string
  getLabel: (item: T) => string
  renderItem: (item: T, offset: number) => ReactNode
  getImageSources?: (item: T) => readonly string[]
  className?: string
  variant: 'scene' | 'poster'
}

export function Carousel<T>({ items, label, getLabel, renderItem, variant, getImageSources, className = '' }: CarouselProps<T>) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const { ref: stageRef, near } = useNearViewport<HTMLDivElement>()
  const motion = useCarouselMotion(items.length, index => {
    if (!getImageSources) return []
    return [-1, 0, 1].flatMap(offset => getImageSources(items[((index + offset) % items.length + items.length) % items.length]))
  }, near)
  const { active, move, select, wrap } = motion

  if (!items.length) return null

  return <section
    className={`design-carousel design-carousel--${variant} ${className}`.trim()}
    data-carousel-count={items.length}
    data-carousel-index={active}
    aria-label={label}
    aria-roledescription="карусель"
    tabIndex={0}
    onKeyDown={(event) => {
      if (!(event.target instanceof Element) || event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        move(event.key === 'ArrowLeft' ? -1 : 1)
      }
    }}
  >
    <div className="design-carousel__row">
      <button type="button" className="design-carousel__arrow" onClick={() => move(-1)} aria-label="Предыдущий слайд"><Icon name="chevron" /></button>
      <div
        ref={stageRef}
        className="design-carousel__stage design-carousel__stage--smooth"
        style={{ '--carousel-duration': `${carouselDuration}ms`, '--carousel-direction': motion.direction } as CSSProperties}
        onTouchStart={(event) => {
          if (event.touches.length !== 1) { touchStart.current = null; return }
          const touch = event.touches[0]
          touchStart.current = { x: touch.clientX, y: touch.clientY }
        }}
        onTouchMove={(event) => {
          const start = touchStart.current
          if (event.touches.length !== 1) { touchStart.current = null; return }
          if (!start) return
          const touch = event.touches[0]
          const dx = touch.clientX - start.x
          const dy = touch.clientY - start.y
          if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) touchStart.current = null
        }}
        onTouchCancel={() => { touchStart.current = null }}
        onTouchEnd={(event) => {
          const start = touchStart.current
          touchStart.current = null
          if (!start || event.touches.length || !event.changedTouches.length) return
          const touch = event.changedTouches[0]
          const dx = touch.clientX - start.x
          const dy = touch.clientY - start.y
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
        }}
      >
        {[...(motion.previousIndex === null ? [] : [{ index: motion.previousIndex, outgoing: true, key: motion.previous }]),
          { index: active, outgoing: false, key: motion.current }].map(layer => <div
          key={layer.key}
          className={`design-carousel__layer ${layer.outgoing ? 'design-carousel__layer--outgoing' : motion.previousIndex !== null ? 'design-carousel__layer--incoming' : ''}`}
          aria-hidden={layer.outgoing ? true : undefined}
          inert={layer.outgoing ? true : undefined}
        >{[-1, 0, 1].map((offset) => {
          const index = wrap(layer.index + offset)
          const position = offset === 0 ? 'main' : offset < 0 ? 'left' : 'right'
          return <div
            key={position}
            className={`design-carousel__slide design-carousel__slide--${position}`}
            aria-hidden={offset !== 0 ? true : undefined}
            role={offset === 0 ? 'group' : undefined}
            aria-roledescription={offset === 0 ? 'слайд' : undefined}
            aria-label={offset === 0 ? `${index + 1} из ${items.length}: ${getLabel(items[index])}` : undefined}
          >{renderItem(items[index], offset)}</div>
        })}</div>)}
      </div>
      <button type="button" className="design-carousel__arrow design-carousel__arrow--next" onClick={() => move(1)} aria-label="Следующий слайд"><Icon name="chevron" /></button>
    </div>
    <div className="design-carousel__dots" aria-label="Выбор слайда">
      {items.map((item, index) => <button
        key={getLabel(item)}
        type="button"
        aria-label={`${index + 1}: ${getLabel(item)}`}
        aria-current={active === index ? 'true' : undefined}
        onClick={() => select(index)}
      ><span /></button>)}
    </div>
    <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{active + 1} из {items.length}: {getLabel(items[active])}</span>
  </section>
}
