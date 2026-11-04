import type { CSSProperties, ReactNode } from 'react'
import { carouselDuration, type useCarouselMotion } from '../hooks/useCarouselMotion'
import '../styles/carousel-motion.css'

type Props = {
  motion: ReturnType<typeof useCarouselMotion>
  renderSlide: (index: number) => ReactNode
}

export function CarouselTransition({ motion, renderSlide }: Props) {
  const layers = [
    ...(motion.previousIndex === null ? [] : [{ index: motion.previousIndex, outgoing: true, key: motion.previous }]),
    { index: motion.active, outgoing: false, key: motion.current },
  ]

  return <div className="carousel-motion" data-carousel-count={motion.count} data-carousel-index={motion.active} style={{ '--carousel-duration': `${carouselDuration}ms`, '--carousel-direction': motion.direction } as CSSProperties}>
    {layers.map(layer => <div
      key={layer.key}
      className={`carousel-motion__layer ${layer.outgoing ? 'carousel-motion__layer--outgoing' : motion.previousIndex !== null ? 'carousel-motion__layer--incoming' : ''}`}
      aria-hidden={layer.outgoing ? true : undefined}
      inert={layer.outgoing ? true : undefined}
    >{renderSlide(layer.index)}</div>)}
  </div>
}
