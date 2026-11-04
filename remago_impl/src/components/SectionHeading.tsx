import type { ReactNode } from 'react'

export function SectionHeading({ eyebrow, title, center = true, ruled = false }: { eyebrow?: string; title: ReactNode; center?: boolean; ruled?: boolean }) {
  return <div className={`section-heading ${center ? 'section-heading--center' : ''} ${ruled ? 'section-heading--ruled' : ''}`}>
    {eyebrow && <div className="section-heading__eyebrow"><span>{eyebrow}</span></div>}
    {title && <h2>{ruled ? <span>{title}</span> : title}</h2>}
  </div>
}
