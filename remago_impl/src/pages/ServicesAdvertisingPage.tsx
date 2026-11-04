import { AssetImage } from '../components/AssetImage'
import { LocationCharacteristics } from '../components/LocationCharacteristics'
import locationReferences from '../data/advertising-location-references.json'
import { yandexLocationsUrl } from '../data/advertisingLegend'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

import { Carousel } from '../components/Carousel'
import { CarouselTransition } from '../components/CarouselTransition'
import { useCarouselMotion } from '../hooks/useCarouselMotion'
import { CampaignPoster } from '../components/CampaignPoster'
import { AdvertisingDetails } from '../components/AdvertisingDetails'
import { advertisingCampaigns } from '../data/campaigns'
import { useNearViewport } from '../hooks/useNearViewport'

// Addresses follow the advertising subpage table; card data comes from the local exports.
type AdLocation = { title: string; note?: string }

const locations: AdLocation[] = [
  { title: 'Селицкого 65' },
  { title: 'Сурганова 50' },
  { title: 'Победителей 89' },
  { title: 'Руссиянова 6' },
  { title: 'Восточная 48' },
  { title: 'Хоружей 17' },
  { title: 'Гинтовта 12' },
  { title: 'Неманская 46' },
  { title: 'Рокоссовского 35' },
  { title: 'Никифорова 45' },
  { title: 'Олешева 1' },
  { title: 'Толбухина 14' },
  { title: 'Широкая 16а' },
  { title: 'Мирошниченко 3' },
  { title: 'Ангарская 17' },
  { title: 'Голодеда 15' },
  { title: 'Рокоссовского 62' },
  { title: 'Московская 12', note: '1н' },
  { title: 'Либкнехта 106А' },
  { title: 'Лещинского 1' },
  { title: 'Победителей 49' },
  { title: 'Тимирязева 10' },
  { title: 'Кальварийская 2' },
  { title: 'Логойский тракт 37', note: 'размещение внутри' },
  {
    title: 'д. Боровляны, ул. 40 лет Победы, 21А',
  },
]

function PinIcon() {
  return (
    <svg viewBox="0 0 48 64" aria-hidden="true">
      <path
        d="M24 2C12.4 2 3 11.2 3 22.6 3 38 24 62 24 62s21-24 21-39.4C45 11.2 35.6 2 24 2Z"
        fill="currentColor"
      />
      <circle cx="24" cy="23" r="8" fill="#fff" />
    </svg>
  )
}

const locationTitleClass = (title: string) =>
  title.length > 30 ? 'is-xlong' : title.length > 18 ? 'is-long' : ''

export function ServicesAdvertisingPage() {
  const locationViewport = useNearViewport<HTMLDivElement>()
  const locationMotion = useCarouselMotion(locations.length, index => [locationReferences[locations[index].title as keyof typeof locationReferences].photo], locationViewport.near)
  const locationIndex = locationMotion.active
  const setLocationIndex = locationMotion.select
  const prevLocation = () => locationMotion.move(-1)
  const nextLocation = () => locationMotion.move(1)
  const references: Record<string, { photo: string; traits: number[]; hours: string; outputs: number }> = locationReferences
  const selectFromTable = (index: number) => {
    setLocationIndex(index)
    if (window.matchMedia('(max-width: 1100px)').matches) {
      locationViewport.ref.current?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
    }
  }

  return (
    <div className="advertising-page advertising-page--reference">
      <section className="service-detail-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Наши услуги', to: '/services' }, { label: '01' }]} />
          <div className="detail-intro">
            <div>
              <h1>Размещение рекламы<br />в наших сетях «Соседи»</h1>
              <p>
                Сеть № 1 «Соседи» — {locations.length} локаций с высоким охватом и вниманием аудитории,
                гибкими форматами и настройкой показов, а также подробной статистикой и отчётностью
              </p>
              <Button to="/services">Вернуться на страницу<br />«Наши услуги»</Button>
            </div>
            <div className="detail-intro__visual">
              <span className="detail-intro__yellow-orbit" aria-hidden="true" />
              <AssetImage loading="eager" fetchPriority="high" src="/assets/advertising-hero.png" alt="Реклама на LED-BOARD Remago" />
            </div>
          </div>
        </div>
      </section>

      <section className="ad-ref-section ad-live-locations" aria-label="Места установки LED-BOARD">
        <div className="container ad-ref-container">
          <div className="ad-live-heading">
            <div className="section-kicker"><span>Список всех адресов</span></div>
            <h2>Места установки</h2>
          </div>
          <div className="ad-live-locations__layout">
            <div className="ad-live-locations__table">
              <table className="ad-address-table">
                <caption className="visually-hidden">Адреса и время работы магазинов с LED-BOARD</caption>
                <thead><tr><th scope="col">№ п/п</th><th scope="col">Адрес магазина</th><th scope="col">Время работы</th></tr></thead>
                <tbody>{locations.map((location, index) => <tr key={location.title} className={index === locationIndex ? 'is-selected' : ''} onClick={() => selectFromTable(index)}><td>{index + 1}</td><td><button type="button" onClick={event => { event.stopPropagation(); selectFromTable(index) }} aria-label={`Показать борд: ${location.title}`}>{location.title}{location.note && ` (${location.note})`}</button></td><td>{references[location.title].hours}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="ad-location-slider" ref={locationViewport.ref}>
              <button type="button" className="round-control ad-location-slider__prev" onClick={prevLocation} aria-label="Предыдущий адрес">
                <Icon name="chevron" />
              </button>
              <div className="ad-location-slider__stage">
                <CarouselTransition motion={locationMotion} renderSlide={index => {
                  const slide = locations[index]
                  const titleClass = locationTitleClass(slide.title)
                  const reference = references[slide.title]
                  return (
                    <article className="ad-location-card ad-location-card--live">
                      <h3 className={titleClass}>{slide.title}</h3>
                      <AssetImage className="ad-location-photo" src={reference.photo} alt={`${slide.title} — место установки LED-BOARD`} />
                      <dl className="ad-location-facts">
                        <div><dt>Расположение</dt><dd>{slide.note === 'размещение внутри' ? 'Внутри магазина «Соседи»' : 'Главный вход в магазин «Соседи»'}</dd></div>
                        <div><dt>Стоимость размещения</dt><dd>399 руб. за 28 дней</dd></div>
                        <div><dt>Время трансляции</dt><dd>{reference.hours}</dd></div>
                        <div><dt>Выходы</dt><dd>&gt; {reference.outputs} в день / &gt; {reference.outputs === 346 ? 9576 : reference.outputs * 28} в месяц</dd></div>
                      </dl>
                      <p className="ad-location-bonus"><b>ЛЕТНИЙ БОНУС</b><br />Летом удваиваем количество выходов и сохраняем прежнюю стоимость</p>
                      <h4>Уникальность места и ЦА</h4>
                      <LocationCharacteristics key={slide.title} traits={reference.traits} />
                      <a className="ad-location-card__map-btn" href={yandexLocationsUrl} target="_blank" rel="noreferrer"><PinIcon /> Показать на карте</a>
                    </article>
                )}} />
              </div>
              <button type="button" className="round-control ad-location-slider__next" onClick={nextLocation} aria-label="Следующий адрес">
                <Icon name="chevron" />
              </button>
              <div className="ad-location-slider__dots" aria-label="Выбор адреса">
                {locations.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={locationIndex === index ? 'active' : ''}
                    aria-current={locationIndex === index ? 'true' : undefined}
                    onClick={() => setLocationIndex(index)}
                    aria-label={`Показать ${item.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ad-ref-section ad-live-map" aria-label="Карта LED-BOARD в Минске">
        <div className="container ad-ref-container">
          <div className="ad-live-map__card">
            <div className="section-kicker"><span>Мы на карте</span></div>
            <div className="ad-map-layout">
              <div className="ad-map-copy"><h2>Карта г. Минск:<br />с 25-ю LED-BOARDS<br />на магазинах<br />ТС «Соседи»</h2><AssetImage src="/assets/subpage-map-mascot.png" alt="Маскот Remago с картой" /></div>
              <a className="ad-yandex-map" href={yandexLocationsUrl} target="_blank" rel="noreferrer" aria-label="Открыть карту мест установки в Яндекс.Картах">
                <AssetImage src="/assets/services/minsk-locations-map.webp" alt="Карта мест установки LED-BOARD в Минске" />
                <span>Открыть в Яндекс.Картах ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <AdvertisingDetails />

      <section className="section campaigns-section advertising-campaigns-ref">
        <div className="container reference-card campaigns-card">
          <div className="section-kicker-wrap">
            <h2 className="ad-campaigns-title"><span />Примеры рекламных кампаний<span /></h2>
          </div>
          <Carousel
            items={advertisingCampaigns}
            label="Примеры рекламных кампаний"
            getLabel={(item) => item.name}
            variant="poster"
            getImageSources={item => item.logo ? [item.image, item.logo] : [item.image]}
            renderItem={(item) => <CampaignPoster campaign={item} />}
          />
        </div>
      </section>

    </div>
  )
}
