'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-10 h-10 rounded-full bg-neutral-100" />

  const activeTheme = theme === 'system' ? resolvedTheme : theme

  return (
    <button
      onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm shadow-sm hover:shadow transition"
      aria-label="Toggle theme"
    >
      <span>{activeTheme === 'dark' ? '🌙' : '🌞'}</span>
      <span className="hidden sm:inline font-medium">{activeTheme === 'dark' ? 'Dark' : 'Light'} mode</span>
    </button>
  )
}
