import { Link } from 'react-router-dom'
import { AssetImage } from '../components/AssetImage'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { services } from '../data/site'

export function ServicesPage() {
  return <>
    <section className="page-hero page-hero--services">
      <div className="container">
        <Breadcrumbs items={[{label:'Наши услуги'}]}/>
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <h1>Умные решения<br/>для вашей рекламы</h1>
            <p>От размещения рекламы до{' '}<br className="desktop-break"/>разработки ПО — полный спектр{' '}<br className="desktop-break"/>услуг для вашего бизнеса</p>
            <Button onClick={() => window.dispatchEvent(new Event('remago:proposal'))} className="hero-offer-button">Коммерческое предложение</Button>
          </div>
          <AssetImage className="page-hero__image" loading="eager" fetchPriority="high" src="/assets/hero-services-ref.png" alt="Маскот Remago и рекламный билборд"/>
        </div>
      </div>
    </section>

    <section className="section services-section">
      <div className="container">
        <SectionHeading eyebrow="Наши услуги" title="Комплексные решения для вашего бизнеса"/>
        <div className="services-grid">
          {services.map(s=><div className="service-column" key={s.no}><Link to={s.href ?? '/contacts'} className={`service-card service-card--${s.no}`}>
            <span className="service-card__no">{s.no}</span>
            <div className="service-card__visual"><AssetImage src={s.image} alt=""/></div>
            <h3>{s.title}</h3>
            <ul>{s.points.map(p=><li key={p}>{p}</li>)}</ul>
          </Link><Button to={s.href ?? '/contacts'}>Подробнее</Button></div>)}
        </div>
      </div>
    </section>
  </>
}
