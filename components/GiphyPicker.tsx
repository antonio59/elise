'use client'
import { useState } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from '@giphy/react-components'

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || 'dc6zaTOxFJmzC')

interface GiphyPickerProps {
  onSelect: (gif: { id: string; url: string; width: number; height: number }) => void
}

export default function GiphyPicker({ onSelect }: GiphyPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fetchGifs = (offset: number) => {
    if (search) {
      return gf.search(search, { offset, limit: 10, rating: 'g' })
    }
    return gf.trending({ offset, limit: 10, rating: 'g' })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1"
      >
        <span className="text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">GIF</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-3 z-50 w-80">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search GIFs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm"
            />
          </div>
          
          <div className="h-64 overflow-y-auto">
            <Grid
              key={search}
              width={260}
              columns={2}
              fetchGifs={fetchGifs}
              onGifClick={(gif, e) => {
                e.preventDefault()
                onSelect({
                  id: gif.id as string,
                  url: gif.images.fixed_height.url,
                  width: gif.images.fixed_height.width,
                  height: gif.images.fixed_height.height
                })
                setIsOpen(false)
              }}
              noLink
            />
          </div>
          
          <div className="mt-2 flex justify-center">
            <img 
              src="https://giphy.com/static/img/giphy-logo-square-180.png" 
              alt="Powered by GIPHY" 
              className="h-6 opacity-50"
            />
          </div>
        </div>
      )}
    </div>
  )
}
