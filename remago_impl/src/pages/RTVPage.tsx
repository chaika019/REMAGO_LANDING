import { AssetImage } from '../components/AssetImage'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SectionHeading } from '../components/SectionHeading'
import { LedBoardPlayer } from '../components/LedBoardPlayer'
import type { RtvChannel } from '../data/rtv-media'

const principles = [
  {
    icon: '/assets/rtv-principle-dooh.png',
    title: 'DOOH',
    text: 'Цифровые экраны\nв местах с высокой\nпроходимостью',
  },
  {
    icon: '/assets/rtv-principle-ai.png',
    title: 'AI-аналитика',
    text: 'Определяет состав\nаудитории\nв реальном времени',
  },
  {
    icon: '/assets/rtv-principle-target.png',
    title: 'Таргетинг',
    text: 'Показываем только\nрелевантный контент\nкаждой группе',
  },
  {
    icon: '/assets/rtv-principle-efficiency.png',
    title: 'Эффективность',
    text: 'Рост вовлеченности\nи максимальный\nрезультат',
  },
] as const

const channels = [
  {
    key: 'marketing',
    title: 'MARKETING',
    image: '/assets/design/rtv-marketing.png',
    text: 'Для всей коммерческой\nрекламы, прямых\nэфиров и конкурсов\nот партнеров',
  },
  {
    key: 'social',
    title: 'SOCIAL',
    image: '/assets/design/rtv-social.png',
    text: 'Размещая рекламу на\nRTV, вы поддерживаете\nсоциальные инициативы:\nпроекты в помощь\nлюдям, животным\nи природе',
  },
  {
    key: 'news',
    title: 'NEWS',
    image: '/assets/design/rtv-news.png',
    text: 'Мятные новости!',
  },
  {
    key: 'gbc',
    title: 'GBC',
    image: '/assets/design/rtv-gbc.png',
    text: 'Ролики формата GBC.\nНапример, Год\nбелорусской женщины,\nМЧС и др.',
  },
  {
    key: 'entertainment',
    title: 'ENTERTAINMENT',
    image: '/assets/design/rtv-entertainment.png',
    text: 'Развлекательный контент',
  },
] as const

export function RTVPage() {
  const [active, setActive] = useState<RtvChannel | null>(null)

  const startOnHover = (channel: RtvChannel, pointerType: string) => {
    if (pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) setActive(channel)
  }
  const closePlayer = (channel: RtvChannel) => {
    const button = document.querySelector<HTMLButtonElement>(channel === 'hero' ? '.rtv-hero-video' : `[data-rtv-channel="${channel}"] .rtv-channel-front`)
    setActive(null)
    requestAnimationFrame(() => button?.focus({ preventScroll: true }))
  }

  return (
    <div className="rtv-page rtv-page--live">
      <section className="page-hero page-hero--rtv">
        <h1 className="visually-hidden">RTV — рекламно-информационный формат</h1>
        <div className="container">
          <Breadcrumbs items={[{ label: 'RTV' }]} />

          <div className="page-hero__grid rtv-hero-grid">
            <div className="page-hero__content rtv-hero-copy">
              <AssetImage loading="eager" className="rtv-logo" sizes="(max-width: 600px) 140px, 190px" src="/assets/rtv-logo.png" alt="RTV" />
              <p className="rtv-intro">
                RTV — это новый формат социального и{' '}<br />
                рекламного информирования <span className="accent-text">(DOOH + AI)</span>{' '}<br />
                Мы объединили поколения, технологии,{' '}<br />
                науку, бизнес и социальные инициативы
              </p>
            </div>

            <div className={`rtv-hero-stage${active === 'hero' ? ' rtv-hero-stage--playing' : ''}`}>
              <button type="button" className="rtv-hero-video" aria-label="Развернуть LED-BOARD и смотреть: Миллениалы и зумеры" aria-expanded={active === 'hero'} hidden={active === 'hero'} onClick={() => setActive('hero')}>
                <AssetImage className="page-hero__image" loading="eager" fetchPriority="high" src="/assets/hero-rtv-ref.png" alt="RTV на цифровом экране" />
                <span className="rtv-hero-play" aria-hidden="true">▶</span>
              </button>
              {active === 'hero' && <LedBoardPlayer channel="hero" title="Миллениалы и зумеры" onClose={() => closePlayer('hero')} />}
            </div>
          </div>
        </div>
      </section>

      <section className="section rtv-principles-section">
        <div className="container">
          <div className="reference-card rtv-principles-card">
            <SectionHeading eyebrow="О формате" title="Принцип работы" />
            <div className="principles-grid">
              {principles.map((item) => (
                <article key={item.title}>
                  <span className="principle-icon">
                    <AssetImage src={item.icon} alt="" aria-hidden="true" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section rtv-channels-section">
        <div className="container">
          <div className="reference-card rtv-channels-card">
            <SectionHeading eyebrow="Наши каналы RTV" title="Единая экосистема контента" />
            <div className="channels-grid">
              {channels.map((channel, index) => {
                return (
                  <article
                    className={`channel-card channel-card--${index + 1}${active === channel.key ? ' is-flipped' : ''}`}
                    key={channel.title}
                    data-rtv-channel={channel.key}
                    onPointerEnter={event => startOnHover(channel.key, event.pointerType)}
                    onPointerLeave={event => { if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) setActive(current => current === channel.key ? null : current) }}
                    onKeyDown={event => { if (event.key === 'Escape') closePlayer(channel.key) }}
                  >
                    <div className="rtv-channel-stage">
                      <div className="rtv-channel-turn">
                        <button type="button" className="rtv-channel-front" aria-label={`Перевернуть и смотреть канал ${channel.title}`} aria-expanded={active === channel.key} aria-hidden={active === channel.key || undefined} inert={active === channel.key || undefined} onClick={() => setActive(channel.key)}>
                          <span className="channel-card__visual"><AssetImage className="channel-card__mascot" src={channel.image} alt="" aria-hidden="true" /></span>
                        </button>
                        <div className="rtv-channel-back" aria-hidden={active !== channel.key || undefined} inert={active !== channel.key || undefined}>
                          {active === channel.key && <LedBoardPlayer key={channel.key} channel={channel.key} title={`RTV ${channel.title}`} onClose={() => closePlayer(channel.key)} />}
                        </div>
                      </div>
                    </div>
                    <h3>{channel.title}</h3>
                    <p>{channel.text}</p>
                  </article>
                )
              })}
            </div>

          </div>
        </div>
      </section>

      <section className="section section--cta rtv-cta-section">
        <div className="container cta-card cta-card--rtv">
          <div className="rtv-cta-copy">
            <h2>Хотите разместить<br />коммерческий контент?</h2>
            <Button onClick={() => window.dispatchEvent(new Event('remago:rtv'))}>Узнать подробнее</Button>
          </div>
          <AssetImage className="cta-card__img" src="/assets/rtv-commerce.png" alt="Коммерческий контент RTV" />
        </div>
      </section>
    </div>
  )
}
