import { Link } from 'react-router-dom'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Хлебные крошки">
    <Link to="/">Главная</Link>
    {items.map((item) => <span key={item.label}><b>/</b>{item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}</span>)}
  </nav>
}
