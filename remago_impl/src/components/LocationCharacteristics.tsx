import { useId, useState } from 'react'
import { AssetImage } from './AssetImage'
import { advertisingLegend } from '../data/advertisingLegend'

export function LocationCharacteristics({ traits }: { traits: number[] }) {
  const tooltipPrefix = useId()
  const [selected, setSelected] = useState<number | null>(null)
  return <div className="location-characteristics">
    {traits.map(id => <span
      className="location-characteristic"
      key={id}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(id) }}
      onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setSelected(null) }}
    >
      <button
        type="button"
        aria-label={advertisingLegend[id]}
        aria-expanded={selected === id}
        aria-describedby={`${tooltipPrefix}-trait-${id}`}
        onClick={() => setSelected(current => current === id ? null : id)}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setSelected(id) }}
        onBlur={() => setSelected(null)}
        onKeyDown={event => { if (event.key === 'Escape') setSelected(null) }}
      >
        <AssetImage src={`/assets/services/legend/${id}.webp`} alt="" />
      </button>
      <span id={`${tooltipPrefix}-trait-${id}`} role="tooltip" className={`location-characteristic__tooltip ${selected === id ? 'is-open' : ''}`}>{advertisingLegend[id]}</span>
    </span>)}
  </div>
}
