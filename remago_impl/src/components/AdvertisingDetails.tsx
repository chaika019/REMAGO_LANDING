import { AssetImage } from './AssetImage'
export function AdvertisingDetails() {
  return <>
    <section className="ad-ref-section ad-vacancies" aria-labelledby="ad-vacancies-title">
      <div className="container ad-ref-container reference-card ad-vacancies__card">
        <div className="section-kicker">Закрытие вакансий</div>
        <div className="ad-vacancies__layout">
          <div>
            <h2 id="ad-vacancies-title">Закрываем вакансии,<br />соединяя с<br />потенциальными<br />работодателями</h2>
            <div className="ad-vacancies__stat"><AssetImage src="/assets/design/vacancy-map-icon.png" alt="" /><p>С 2016 ГОДА МЫ ПРОВЕЛИ 250+<br />КАМПАНИЙ ПО ЗАКРЫТИЮ ВАКАНСИЙ<br />В РЕГИОНАЛЬНЫХ ГОРОДАХ</p></div>
          </div>
          <div className="ad-board-video"><AssetImage src="/assets/design/vacancy-board.png" alt="Пример кампании по закрытию вакансий" /></div>
        </div>
      </div>
    </section>
    <section className="ad-ref-section ad-tariffs" aria-labelledby="ad-tariffs-title">
      <div className="container ad-ref-container reference-card ad-tariffs__card">
        <h2 id="ad-tariffs-title" className="ad-tariffs__title">Тарифы</h2>
        <div className="ad-tariffs__plans">
          {[['Прайм-тайм новинок', '17:00', '23:00', '9,99'], ['Стандарт', '11:00', '17:00', '6,67']].map(([title, start, end, price]) => <article className="ad-tariff" key={title}>
            <h3>{title}</h3>
            <p>Период эфирного<br />вещания с {start} по {end}</p>
            <strong>{price} руб.<br />за таймслот*</strong>
            <AssetImage className="ad-tariff__clock" src="/assets/design/tariff-clock.png" alt="" />
          </article>)}
        </div>
        <div className="ad-tariffs__details">
          <div>
            <p>Количество выходов таймслотов внутри<br className="desktop-break" />Тарифного плана «Прайм-тайм» и «Стандарт» —<br className="desktop-break" />не менее 144 выходов или не менее 1440 сек<br className="desktop-break" />эфира в сутки</p>
            <div className="ad-tariffs__note"><AssetImage src="/assets/design/tariff-clock.png" alt="" /><small>Таймслот — это 10-ти секундный<br />временной интервал эфира,<br />повторяющийся не менее<br />144 раз за сутки</small></div>
          </div>
          <div className="ad-board-video"><AssetImage src="/assets/subpage-pricing-board.png" alt="Пример размещения рекламы на LED-BOARD" /></div>
        </div>
      </div>
    </section>
  </>
}
