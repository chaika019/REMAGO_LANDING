import { AssetImage } from '../components/AssetImage'
import { Button } from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { HomeSceneCarousel } from '../components/HomeSceneCarousel'
import { useNearViewport } from '../hooks/useNearViewport'

const smartSlides = [
  { file: 'cafe', label: 'Кафе' },
  { file: 'medical', label: 'Медицинский центр' },
  { file: 'shop', label: 'Магазин' },
  { file: 'circular-screen', label: 'Круговой экран' },
  { file: 'billboard', label: 'Брандмауэр на центральных проспектах' },
  { file: 'arena', label: 'Спортивная арена' },
  { file: 'residential-entrance', label: 'Вход в ЖК' },
  { file: 'gas-station', label: 'АЗС' },
  { file: 'bus-stop', label: 'Автобусная остановка' },
].map(({ file, label }) => ({
  image: `/assets/home/${file}-center.webp`,
  sideImage: `/assets/home/${file}-side.webp`,
  label,
}))

const homePartners = [
  {
    name: 'ENCATA',
    logo: '/assets/home/partner-encata.svg',
    text: 'Сервис конструкторской разработки и прототипирования новых продуктов. Уникальность ИнКата заключается в объединении под одной крышей конструкторского бюро и опытного производства, которое работает по принципам «бережливого производства», а для резидентов в формате «под крылом»',
  },
  {
    name: 'Соседи',
    logo: '/assets/home/partner-sosedi.svg',
    text: 'Стратегический партнер ГК «Соседи» — крупнейшая торговая сеть Беларуси, насчитывает более 230 магазинов, более 8000 сотрудников, около 1000 касс в магазинах сети, более 25 000 покупок в час. Выступает стратегическим партнером проекта «it-дом»',
  },
  {
    name: 'Ассоциация технопарков и субъектов инновационной деятельности',
    logo: '/assets/home/partner-association.svg',
    text: 'Ассоциация технопарков и субъектов инновационной деятельности создана 7 февраля 2025 года. Её главная цель — координация деятельности и защита интересов технопарков и субъектов инновационной деятельности на республиканском и региональном уровнях.',
  },
  {
    name: 'REMAGO',
    logo: '/assets/home/partner-remago.svg',
    text: 'Инновационная компания, резидент и стратегический партнер научно-технологического парка ООО «Инката», сооснователь Ассоциации технопарков и субъектов инновационной деятельности',
  },
] as const

export function HomePage() {
  const strategy = useNearViewport<HTMLDivElement>()
  const contact = useNearViewport<HTMLDivElement>()
  return <div className="home-page">
    <section className="home-intro">
      <div className="container">
        <div className="home-intro__crumb">Главная</div>
        <div className="home-intro__grid">
          <div className="home-intro__copy">
            <h1>Превращаем идеи в инновации,<br />а инновации <span className="accent">—</span> в результат</h1>
            <p className="home-intro__description">
              Инновационная компания и стратегический{' '}<br className="desktop-break" />
              партнёр научно-технологического парка «Инката».{' '}<br className="desktop-break" />
              Объединяем технологии и экспертизу,{' '}<br className="desktop-break" />
              чтобы превращать идеи в результат
            </p>
            <Button to="/services">Перейти к услугам</Button>
          </div>

          <div className="home-intro__visual" aria-label="Маскот Remago">
            <AssetImage className="home-intro__composition" loading="eager" fetchPriority="high" src="/assets/home/hero-composition.webp" alt="Маскот Remago и символы инноваций" />
          </div>
        </div>
      </div>
    </section>

    <section className="section smart-section">
      <div className="container">
        <SectionHeading eyebrow="LED-борды с AI-аналитикой" title="Примеры использования SMART-бордов" />
        <HomeSceneCarousel items={smartSlides} />
      </div>
    </section>

    <section className="home-strategy">
      <div className="container">
        <SectionHeading eyebrow="Стратегические партнеры" title={<><span className="accent-text">Вместе</span> создаем <span className="accent-text">будущие</span> технологии</>} />
        <div className="home-strategy__grid" ref={strategy.ref} data-background-ready={strategy.near || undefined}>
          {homePartners.map((partner) => (
            <div className="home-strategy__column" key={partner.name}>
              <article className="home-strategy__card">
                <div className="home-strategy__logo"><AssetImage src={partner.logo} alt={partner.name} /></div>
                <p>{partner.text}</p>
              </article>
              <Button to="/partners" showArrow={false}>Подробнее</Button>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="home-about">
      <div className="container home-about__card">
        <div className="home-about__headline">
          <h2>Двигаемся вперед,<br />достигаем большего</h2>
        </div>
        <div className="home-about__eyebrow"><span><AssetImage src="/assets/home/about-label.svg" alt="О Remago" width={147} height={38} /></span></div>
        <div className="home-about__stats">
          <div>
            <AssetImage className="home-about__icon" src="/assets/home/help.webp" alt="" />
            <strong>С 2016 ГОДА</strong>
            <small>Помогаем людям, фондам<br />и иная социальная<br />помощь</small>
          </div>
          <div>
            <AssetImage className="home-about__icon" src="/assets/home/award.webp" alt="" />
            <strong>&gt; 10 ЛЕТ</strong>
            <small>Опыта, достижений<br />и наград в сфере<br />маркетинга и инноваций</small>
          </div>
          <div>
            <AssetImage className="home-about__icon" src="/assets/home/ai.webp" alt="" />
            <strong>ПЕРВАЯ AI-СЕТЬ</strong>
            <small>Собственная<br />инновационная сеть<br />из 25 LED-экранов</small>
          </div>
        </div>
        <div className="home-about__visual">
          <AssetImage className="home-about__orbit" src="/assets/home/innovation-wave.svg" alt="" aria-hidden="true" />
          <AssetImage className="home-about__mascot" src="/assets/home/about-mascot.webp" alt="Маскот Remago" />
        </div>
      </div>
    </section>

    <section className="home-contact">
      <div className="container home-contact__card" ref={contact.ref} data-background-ready={contact.near || undefined}>
        <div><h2>Возникли вопросы?</h2><p>Свяжитесь с нами — обсудим ваши идеи{' '}<br />и найдем лучшее решение для реализации</p></div>
        <button type="button" className="button button--primary button--phone" onClick={() => window.dispatchEvent(new Event('remago:callback'))}>Заказать звонок <AssetImage className="home-contact__phone" src="/assets/home/telephone.webp" width={36} height={36} alt="" /></button>
      </div>
    </section>
  </div>
}
