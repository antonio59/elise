'use client'
import { useState } from 'react'
import { STICKER_PACKS } from '@/lib/types'

interface StickerPickerProps {
  onSelect: (sticker: string, isCustom?: boolean, imageUrl?: string) => void
  customStickers?: Array<{ id: string; name: string; imageUrl: string }>
}

export default function StickerPicker({ onSelect, customStickers = [] }: StickerPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePack, setActivePack] = useState<keyof typeof STICKER_PACKS | 'custom'>('reading')

  const packs = Object.keys(STICKER_PACKS) as (keyof typeof STICKER_PACKS)[]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1"
      >
        <span className="text-xl">🎨</span>
        <span className="text-sm">Stickers</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-3 z-50 w-72">
          <div className="flex gap-1 mb-3 overflow-x-auto pb-2">
            {packs.map((pack) => (
              <button
                key={pack}
                type="button"
                onClick={() => setActivePack(pack)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  activePack === pack
                    ? 'bg-inkPink text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                {STICKER_PACKS[pack].name}
              </button>
            ))}
            {customStickers.length > 0 && (
              <button
                type="button"
                onClick={() => setActivePack('custom')}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  activePack === 'custom'
                    ? 'bg-inkPink text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                My Art ✨
              </button>
            )}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {activePack !== 'custom' ? (
              STICKER_PACKS[activePack].stickers.map((sticker, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onSelect(sticker)
                    setIsOpen(false)
                  }}
                  className="text-2xl p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all hover:scale-110"
                >
                  {sticker}
                </button>
              ))
            ) : (
              customStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  onClick={() => {
                    onSelect(sticker.name, true, sticker.imageUrl)
                    setIsOpen(false)
                  }}
                  className="aspect-square rounded-lg hover:ring-2 ring-inkPink transition-all overflow-hidden"
                >
                  <img
                    src={sticker.imageUrl}
                    alt={sticker.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))
            )}
          </div>

          {activePack === 'custom' && customStickers.length === 0 && (
            <p className="text-center text-sm text-neutral-500 py-4">
              No custom stickers yet!<br />
              Create some from your artwork 🎨
            </p>
          )}
        </div>
      )}
    </div>
  )
}
