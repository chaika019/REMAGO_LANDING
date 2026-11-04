import { Carousel } from '../components/Carousel'
import { AssetImage } from '../components/AssetImage'
import { Icon } from '../components/Icon'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { CarouselTransition } from '../components/CarouselTransition'
import { useCarouselMotion } from '../hooks/useCarouselMotion'
import { customBoardSlides } from '../data/custom-boards'

const productImages = ['/assets/hero-product-ref.png', '/assets/products/outdoor-board-mascot.webp'] as const

const leftSpecs = [
  ['shield','Дружит с законом о рекламе (экономит ваши деньги)','Не требует паспорта рекламы и согласования'],
  ['phone','Уникальный формат «Телефон»','Ваше видео из соцсетей залетает на ура'],
  ['sound','Долбит звуком','Воздействуем на 2 из 5 органов чувств человека'],
  ['money','от 12000 BYN*',''],
] as const

const rightSpecs = [
  ['analytics','AI-аналитика','Теория массового обслуживания населения'],
  ['charge','Бесплатная зарядка для телефонов прохожих',''],
  ['timer','Скорость запуска рекламы','10 минут'],
  ['idea','На базе научных исследований','Теория массового обслуживания населения'],
] as const

function SpecIcon({type}:{type:string}) {
  return <AssetImage className="spec-icon-art" src={`/assets/design/spec-${type}.png`} alt="" aria-hidden="true" />
}

function ProductTypeArrow() {
  return <svg className="product-types-arrow" viewBox="0 0 610 150" aria-hidden="true">
    <defs>
      <marker id="productArrowHead" markerWidth="11" markerHeight="11" refX="9.2" refY="4.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0 0 10 4.5 0 9Z" fill="#f2c500" />
      </marker>
    </defs>
    <path
      d="M8 42 C58 69 111 72 151 59 C177 51 183 22 167 11 C147 -3 126 11 130 36 C134 64 164 82 190 92 C222 105 252 98 282 87 C378 52 467 25 596 8"
      fill="none"
      stroke="#f2c500"
      strokeWidth="3.4"
      strokeDasharray="13 12"
      strokeLinecap="butt"
      markerEnd="url(#productArrowHead)"
    />
  </svg>
}


export function ProductsPage() {
  const motion = useCarouselMotion(productImages.length, index => [productImages[index]])
  const outdoor = motion.active === 1
  return <>
    <section className="page-hero page-hero--product">
      <div className="container">
        <Breadcrumbs items={[{label:'Продукция'}]}/>
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <h1>Умный <span className="accent-text">LED-BOARD</span><br/>для вашей рекламы</h1>
            <p>Инновационный формат наружной рекламы с AI-аналитикой. LED-борды устанавливаются без согласования с исполнительными и распорядительными органами, не требуют паспорта рекламы и согласования сюжета.</p>
            <div className="product-types-wrap">
              <div className="product-types">Мы производим 2 типа<br/><span>умных LED-бордов</span></div>
              <ProductTypeArrow />
            </div>
          </div>
          <div className="product-hero-visual">
            <button type="button" className="round-control product-hero-prev" onClick={() => motion.move(-1)} aria-label="Предыдущий тип LED-BOARD"><Icon name="chevron" /></button>
            <CarouselTransition motion={motion} renderSlide={index => <AssetImage loading="eager" fetchPriority="high" className={`page-hero__image ${index === 1 ? 'product-hero-image--outdoor' : ''}`} src={productImages[index]} alt={index === 1 ? 'LED-BOARD для наружного применения' : 'LED-BOARD Remago с AI'} draggable={false} />} />
            <button type="button" className="round-control product-hero-next" onClick={() => motion.move(1)} aria-label="Следующий тип LED-BOARD"><Icon name="chevron" /></button>
            <small className="product-hero-internal-note" aria-live="polite">{outdoor ? '*для наружного применения.' : '*для внутреннего использования.'}</small>
          </div>
        </div>
      </div>
    </section>

    <section className="section product-spec-section">
      <div className="container">
        <div className="reference-card product-spec-card">
          <SectionHeading eyebrow="Наш LED-BOARD" title="Технические характеристики и УТП" ruled/>
          <div className="product-spec-layout">
            <div className="spec-list spec-list--left">{leftSpecs.map(([type,t,d])=><div className="spec-row" key={t}><div><b>{t}</b>{d && <small>{d}</small>}</div><span className="spec-icon"><SpecIcon type={type}/></span></div>)}</div>
            <AssetImage className="board-unit" src="/assets/design/product-board.png" alt="LED-BOARD Remago"/>
            <div className="spec-list spec-list--right">{rightSpecs.map(([type,t,d])=><div className="spec-row" key={t}><span className="spec-icon"><SpecIcon type={type}/></span><div><b>{t}</b>{d && <small>{d}</small>}</div></div>)}</div>
          </div>
          <p className="product-note"><b>*ver 1.0.1</b> — для наружного применения (уличный)<br/>Наилучшее место установки — входная группа в магазин, павильон, ТЦ</p>
        </div>
      </div>
    </section>

    <section className="section product-work-section">
      <div className="container">
        <div className="reference-card product-work-card">
          <SectionHeading eyebrow="Принцип работы" title=""/>
          <div className="product-work-layout">
            <div>
              <h2>Как работает умный<br/>LED-BOARD ver 1.0.1</h2>
              <p>AI-анализирует аудиторию<br/>в реальном времени<br/>и собирает аналитику</p>
              <p className="product-analytics-prompt">Хотите посмотреть пример аналитики?</p>
              <Button to="/contacts" showArrow={false}>Звоните — обсудим!</Button>
            </div>
            <AssetImage src="/assets/smart-audience.png" alt="Пример работы AI-аналитики LED-BOARD"/>
          </div>
        </div>
      </div>
    </section>
    <section className="section product-custom-section">
      <div className="container reference-card">
        <SectionHeading eyebrow="Индивидуальные решения" title="Возможно изготовление индивидуальных LED&SMART бордов" />
        <Carousel
          items={customBoardSlides}
          label="Индивидуальные LED&SMART борды"
          getLabel={item => item.title}
          variant="scene"
          getImageSources={item => item.sideImage ? [item.image, item.sideImage] : [item.image]}
          renderItem={(item, offset) => <figure className="custom-board-slide">
            <AssetImage
              src={offset !== 0 && item.sideImage ? item.sideImage : item.image}
              alt={item.title}
              style={offset !== 0 && !item.sideImage ? { opacity: 0.5 } : undefined}
              draggable={false}
            />
          </figure>}
        />
      </div>
    </section>
  </>
}
