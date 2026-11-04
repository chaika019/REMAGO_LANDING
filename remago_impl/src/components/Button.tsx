import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

type Props = {
  children: ReactNode
  to?: string
  href?: string
  variant?: 'primary' | 'ghost' | 'outline'
  onClick?: () => void
  className?: string
  showArrow?: boolean
}

export function Button({ children, to, href, variant = 'primary', onClick, className = '', showArrow = true }: Props) {
  const cn = `button button--${variant} ${className}`.trim()
  const content = <>{children}{showArrow && <Icon name="arrow" size={18}/>}</>
  if (to) return <Link to={to} className={cn}>{content}</Link>
  if (href) return <a href={href} className={cn}>{content}</a>
  return <button className={cn} onClick={onClick}>{content}</button>
}
