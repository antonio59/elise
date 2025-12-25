'use client'
import { useState, useEffect, useRef } from 'react'
import { STICKER_LIBRARY, STICKER_CATEGORIES, LibrarySticker } from '@/lib/stickerLibrary'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'

type StickerLibraryPickerProps = {
  onSelect: (sticker: { name: string; url: string }) => void
}

export default function StickerLibraryPicker({ onSelect }: StickerLibraryPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(STICKER_CATEGORIES[0])
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Get custom stickers from Convex
  const customStickers = useQuery(api.stickers.getAll) ?? []

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (sticker: LibrarySticker | { name: string; imageUrl: string }) => {
    onSelect({ 
      name: sticker.name, 
      url: 'imageUrl' in sticker ? sticker.imageUrl : sticker.url 
    })
    setIsOpen(false)
  }

  const filteredStickers = STICKER_LIBRARY.filter(s => s.category === activeCategory)
  const allCategories = customStickers.length > 0 
    ? ['My Stickers', ...STICKER_CATEGORIES] 
    : STICKER_CATEGORIES

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Add Sticker"
      >
        <span className="text-xl">🏷️</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 w-80 z-50">
          {/* Category Tabs */}
          <div className="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto">
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stickers Grid */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {activeCategory === 'My Stickers' ? (
              customStickers.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {customStickers.map((sticker) => (
                    <button
                      key={sticker._id}
                      type="button"
                      onClick={() => handleSelect(sticker)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title={sticker.name}
                    >
                      <img src={sticker.imageUrl} alt={sticker.name} className="w-10 h-10 object-contain" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm py-4">
                  No custom stickers yet. Create some in Admin!
                </p>
              )
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {filteredStickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => handleSelect(sticker)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={sticker.name}
                  >
                    <img src={sticker.url} alt={sticker.name} className="w-10 h-10 object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
