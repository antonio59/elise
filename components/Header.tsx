'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/convex'
import NotificationBell from './NotificationBell'

export default function Header() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)
    setDarkMode(isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    const newDark = !darkMode
    setDarkMode(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newDark)
  }

  const displayName = user?.username || user?.email?.split('@')[0] || 'User'

  return (
    <header className="border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-inkBlack/80 backdrop-blur-sm z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">Elise</Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <Link href="/explore" className="hover:text-inkPink transition-colors">Explore</Link>
          <Link href="/bookshelf" className="hover:text-inkCyan transition-colors">Bookshelf</Link>
          <Link href="/gallery" className="hover:text-inkPurple transition-colors">Gallery</Link>
          {!loading && user && (
            <>
              <Link href="/dashboard" className="hover:text-inkLime transition-colors">Dashboard</Link>
              {user.role === 'parent' && (
                <>
                  <Link href="/parent" className="hover:text-inkYellow transition-colors">Parent View</Link>
                  <Link href="/manage" className="hover:text-inkPurple transition-colors">Manage</Link>
                </>
              )}
              <Link href="/profile" className="hover:text-inkYellow transition-colors">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full inline mr-1" />
                ) : null}
                {displayName}
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-40 lg:w-56 px-3 py-1.5 pl-8 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-inkPink"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          </form>
          {user && <NotificationBell />}
          <button
            onClick={toggleDark}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          {!loading && (
            user ? (
              <button
                onClick={logout}
                className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-inkPink px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
              >
                Log In
              </Link>
            )
          )}
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
        <div className="md:hidden border-t border-neutral-100 dark:border-neutral-800 px-4 py-4 space-y-3 bg-white dark:bg-inkBlack">
          <Link href="/explore" className="block py-2 hover:text-inkPink" onClick={() => setMobileOpen(false)}>Explore</Link>
          <Link href="/bookshelf" className="block py-2 hover:text-inkCyan" onClick={() => setMobileOpen(false)}>Bookshelf</Link>
          <Link href="/gallery" className="block py-2 hover:text-inkPurple" onClick={() => setMobileOpen(false)}>Gallery</Link>
          {!loading && user && (
            <>
              <Link href="/dashboard" className="block py-2 hover:text-inkLime" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {user.role === 'parent' && (
                <>
                  <Link href="/parent" className="block py-2 hover:text-inkYellow" onClick={() => setMobileOpen(false)}>Parent View</Link>
                  <Link href="/manage" className="block py-2 hover:text-inkPurple" onClick={() => setMobileOpen(false)}>Manage Content</Link>
                </>
              )}
              <Link href="/profile" className="block py-2 hover:text-inkYellow" onClick={() => setMobileOpen(false)}>Profile</Link>
            </>
          )}
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button onClick={toggleDark} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
              {darkMode ? '☀️' : '🌙'}
            </button>
            {!loading && (
              user ? (
                <button onClick={logout} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium">
                  Log Out
                </button>
              ) : (
                <Link href="/login" className="rounded-full bg-inkPink px-4 py-2 text-sm font-medium text-white">
                  Log In
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}
