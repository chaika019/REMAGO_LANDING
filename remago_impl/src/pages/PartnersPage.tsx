import { AssetImage } from '../components/AssetImage'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { PartnerCampaignCarousel } from '../components/PartnerCampaignCarousel'

export function PartnersPage() {
  return <>
    <section className="page-hero page-hero--partners">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Партнеры' }]} />
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <h1>Наши первые партнеры<br />на <span className="accent-text">LED &amp; SMART</span> бордах</h1>
            <p>Мы запускаем большие идеи<br />и реализуем их вместе с теми,<br />кому доверяем</p>
            <Button to="/products">Перейти к продукции</Button>
          </div>
          <AssetImage className="page-hero__image" loading="eager" fetchPriority="high" src="/assets/hero-partners-ref.png" alt="Маскот Remago с бумажным самолетом" />
        </div>
      </div>
    </section>

    <section className="section partners-section">
      <div className="container">
        <SectionHeading eyebrow="Партнеры" title="С нами уже сотрудничают" />
        <PartnerCampaignCarousel />
      </div>
    </section>

    <section className="section section--cta">
      <div className="container idea-card">
        <div><h2>Открыты к новым идеям<br />и совместным проектам</h2><p>Каждое партнерство открывает новые горизонты<br />для развития и достижения общих целей</p></div>
        <AssetImage src="/assets/puzzle-ref.png" alt="Пазл — символ партнерства" />
      </div>
    </section>
  </>
}
