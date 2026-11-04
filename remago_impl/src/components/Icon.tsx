import type { ReactNode } from 'react'

type IconName = 'at' | 'arrow' | 'globe' | 'phone' | 'mail' | 'telegram' | 'target' | 'screen' | 'chip' | 'chart' | 'menu' | 'close' | 'chevron'

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  const paths: Record<IconName, ReactNode> = {
    at: <><circle cx="12" cy="12" r="9"/><path d="M16 8v6a2 2 0 0 0 4 0M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0"/></>,
    arrow: <path d="M3 10.5h11V6l8 6-8 6v-4.5H3Z" fill="currentColor" stroke="none"/>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.8a2 2 0 0 1-.45 2.11L8.07 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.84.55 2.8.68A2 2 0 0 1 22 16.92Z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    telegram: <path d="m21 4-7 16-4-6-6-4 17-6Zm-11 10 11-10"/>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M15 9 21 3"/></>,
    screen: <><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8M12 18v4"/></>,
    chip: <><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    chevron: <path d="m9 6 6 6-6 6"/>,
  }
  return <svg {...common}>{paths[name]}</svg>
}
