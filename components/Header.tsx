'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const siteSettings = useQuery(api.siteSettings.get)

  const siteName = siteSettings?.siteName || "Niece's World"

  const navItems = [
    { href: '/', label: 'Bookshelf', icon: '📚', activeColor: 'bg-purple-600' },
    { href: '/gallery', label: 'My Art', icon: '🎨', activeColor: 'bg-pink-500' },
    { href: '/reviews', label: 'Reviews', icon: '📝', activeColor: 'bg-amber-500' },
    { href: '/admin', label: 'Admin', icon: '⚙️', activeColor: 'bg-gray-600' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 bg-white/90 dark:bg-black/60 backdrop-blur-sm z-50 border-b border-gray-100 dark:border-neutral-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gradient-purple">
          {siteName}
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-pill ${
                isActive(item.href)
                  ? `nav-pill-active ${item.activeColor}`
                  : 'nav-pill-inactive'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`hamburger-line ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-neutral-800 px-4 py-4 space-y-2 bg-white dark:bg-neutral-900">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-xl font-medium ${
                isActive(item.href)
                  ? `text-white ${item.activeColor}`
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      )}
    </header>
  )
}
