import { AssetImage } from './AssetImage'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Brand } from './Brand'
import { Icon } from './Icon'
import { navItems } from '../data/site'
import { ContactDialogs } from './ContactDialogs'

export function SiteLayout() {
  const [menu, setMenu] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const titles: Record<string, string> = { '/': 'Home Page', '/partners': 'Partners', '/products': 'Products', '/rtv': 'RTV', '/services': 'Services', '/services/advertising': 'Services — Subpage 01', '/contacts': 'Contacts', '/faq': 'FAQ' }
    document.title = `${titles[pathname] ?? 'Page Not Found'} | REMAGO`
    setMenu(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    if (!menu) return
    const dismiss = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false)
        menuButtonRef.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 1201px)')
    const resize = () => { if (desktop.matches) setMenu(false) }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    desktop.addEventListener('change', resize)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
      desktop.removeEventListener('change', resize)
    }
  }, [menu])

  return <>
    <a className="skip-link" href="#main-content">Перейти к содержимому</a>
    <header className="site-header" ref={headerRef}>
      <div className="container site-header__inner">
        <Brand />
        <nav id="main-navigation" className={`nav ${menu ? 'nav--open' : ''}`} aria-label="Основная навигация">
          {navItems.map(i => <NavLink key={i.path} to={i.path} onClick={() => setMenu(false)} className={({ isActive }) => isActive ? 'active' : ''}>{i.label}</NavLink>)}
        </nav>
        <div className="site-header__actions">
          <span className="lang-button" title="Язык сайта: русский"><AssetImage loading="eager" src="/assets/design/language-globe.png" alt="Язык сайта: русский" /></span>
          <button ref={menuButtonRef} type="button" className="menu-button" aria-controls="main-navigation" aria-expanded={menu} aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenu(v => !v)}><Icon name={menu ? 'close' : 'menu'} size={28}/></button>
        </div>
      </div>
    </header>

    <main id="main-content" tabIndex={-1}><Outlet /></main>
    <ContactDialogs />

    <footer className={`site-footer ${pathname === '/' ? 'site-footer--home' : ''}`}>
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Brand />
          <p>© 2026, Минск, ООО «Ремаго»<br/>Все права защищены</p>
        </div>
        <div className="site-footer__right">
          <nav className="site-footer__links" aria-label="Документы">
            {['Документы', 'Политика конфиденциальности', 'Пользовательское соглашение'].map(label => <a
              key={label}
              href={`mailto:remago@bk.ru?subject=${encodeURIComponent(`Запрос документа: ${label}`)}`}
              title="Запросить документ по электронной почте"
              aria-label={`${label} — запросить по электронной почте`}
            >{label}</a>)}
          </nav>
          <div className="footer-social">
            <a href="mailto:remago@bk.ru" aria-label="Электронная почта"><Icon name="mail" size={28}/></a>
            <a href="https://t.me/remago_remago" target="_blank" rel="noreferrer" aria-label="Telegram"><Icon name="telegram" size={28}/></a>
          </div>
        </div>
      </div>
    </footer>
  </>
}
