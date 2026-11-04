import { AssetImage } from '../components/AssetImage'
import { useMemo, useState } from 'react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { faqItems } from '../data/site'

const cats = ['Все вопросы','Продукция','Услуги','Оплата и договоры'] as const

type FaqIconName = 'all' | 'product' | 'services' | 'payment'
const catIconNames: FaqIconName[] = ['all', 'product', 'services', 'payment']

function FaqCategoryIcon({ name }: { name: FaqIconName }) {
  return <AssetImage className="faq-tab-icon" src={`/assets/design/faq-${name}.png`} alt="" aria-hidden="true" />
}

export function FAQPage() {
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [open,setOpen] = useState<Set<string>>(new Set())
  const items = useMemo(() => faqItems.filter(item => !categories.size || categories.has(item.category)), [categories])

  const toggleCategory = (category: string) => {
    setCategories(current => {
      if (category === 'Все вопросы') return new Set()
      const next = new Set(current)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
    setOpen(new Set())
  }

  const toggleAnswer = (question: string) => {
    setOpen(current => {
      const next = new Set(current)
      if (next.has(question)) next.delete(question)
      else next.add(question)
      return next
    })
  }

  return <>
    <section className="page-hero page-hero--faq">
      <div className="container">
        <Breadcrumbs items={[{label:'FAQ'}]}/>
        <div className="page-hero__grid">
          <div className="page-hero__content">
            <h1>FAQ — ответы<br/><span className="accent-text">на частые вопросы</span></h1>
            <p>Здесь вы найдете ответы<br/>на популярные вопросы<br/>о наших продуктах, услугах<br/>и сотрудничестве с Remago</p>
            <Button to="/contacts" showArrow={false}>Остались вопросы? Обсудим!</Button>
          </div>
          <AssetImage className="page-hero__image" loading="eager" fetchPriority="high" src="/assets/design/faq-hero.png" alt="FAQ Remago"/>
        </div>
      </div>
    </section>

    <section className="section faq-section">
      <div className="container faq-container">
        <div className="faq-tabs" aria-label="Категории вопросов">
          {cats.map((category, index) => {
            const selected = index === 0 ? !categories.size : categories.has(category)
            return <button type="button" key={category} className={selected ? 'active' : ''} aria-pressed={selected} onClick={() => toggleCategory(category)}>
              <FaqCategoryIcon name={catIconNames[index]} />
              <span className="faq-tab-label">{category}</span>
            </button>
          })}
        </div>
        <div className="faq-list">
          {items.map(item => {
            const expanded = open.has(item.q)
            const id = `faq-${faqItems.indexOf(item)}`
            return <article className={`faq-item ${expanded ? 'open' : ''}`} key={item.q}>
              <button type="button" id={`${id}-question`} onClick={() => toggleAnswer(item.q)} aria-expanded={expanded} aria-controls={`${id}-answer`}>
                <span>{item.q}</span><b aria-hidden="true">{expanded ? '−' : '+'}</b>
              </button>
              <div id={`${id}-answer`} hidden={!expanded} aria-labelledby={`${id}-question`}>
                {expanded && <p>{item.a}</p>}
              </div>
            </article>
          })}
        </div>
      </div>
    </section>
  </>
}
