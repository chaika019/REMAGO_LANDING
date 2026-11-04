import { AssetImage } from '../components/AssetImage'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Icon } from '../components/Icon'

const cards = [
  ['phone','Руководство','Дмитрий Лабкович','+375 (29) 578-91-13','tel:+375295789113'],
  ['mail','Отдел маркетинга\nи рекламы','Ульяна Трусевич','+375 (44) 569-95-14','tel:+375445699514'],
  ['telegram','Telegram','@remago_remago','','https://t.me/remago_remago'],
  ['at','Общие вопросы','remago@bk.ru','','mailto:remago@bk.ru'],
] as const

export function ContactsPage() {
  return <>
    <section className="page-hero page-hero--contacts">
      <div className="container">
        <Breadcrumbs items={[{label:'Контакты'}]}/>
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <h1>Контакты</h1>
            <p>Мы всегда на связи и готовы<br/>ответить на ваши вопросы.<br/>Выберите нужный отдел либо<br/>напишите нам напрямую</p>
            <button type="button" className="button button--primary" onClick={() => window.dispatchEvent(new Event('remago:support'))}>Служба поддержки <Icon name="arrow" size={32}/></button>
          </div>
          <AssetImage className="page-hero__image" loading="eager" fetchPriority="high" src="/assets/design/contacts-hero.png" alt="Контакты Remago"/>
        </div>
      </div>
    </section>

    <section className="section contacts-section">
      <div className="container">
        <div className="contacts-grid">
          {cards.map(([icon,title,name,value,href])=><a className="contact-card" href={href} key={title} target={href.startsWith('http')?'_blank':undefined} rel="noreferrer">
            <span className="contact-card__icon"><AssetImage src={`/assets/design/contact-${icon}.png`} alt="" /></span>
            <div><small>{title.split('\n').map((line,i)=><span key={i}>{line}{i<title.split('\n').length-1&&<br/>}</span>)}</small><h3>{name}</h3>{value&&<p>{value}</p>}</div>
          </a>)}
        </div>
      </div>
    </section>

    <section className="section section--cta contacts-idea-section">
      <div className="container idea-card idea-card--contacts">
        <div><h2>Давайте создавать<br/>будущее вместе!</h2><p>Мы открыты к новым идеям,<br/>партнёрствам и интересным проектам</p></div>
        <AssetImage src="/assets/about-remago.png" alt="Маскот Remago"/>
      </div>
    </section>
  </>
}
