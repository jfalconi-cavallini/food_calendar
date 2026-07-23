'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/',         label: 'Plan',     emoji: '📅' },
  { href: '/grocery',  label: 'Grocery',  emoji: '🛒' },
  { href: '/summary',  label: 'Summary',  emoji: '📊' },
  { href: '/profiles', label: 'Profiles', emoji: '👤' },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-0.5">
      {LINKS.map(({ href, label, emoji }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              active
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span>{emoji}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
