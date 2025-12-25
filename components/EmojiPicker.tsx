'use client'
import { useEffect, useRef, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  trigger?: React.ReactNode
}

export default function EmojiPicker({ onSelect, trigger }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        {trigger || <span className="text-xl">😊</span>}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              onSelect(emoji.native)
              setIsOpen(false)
            }}
            theme="auto"
            previewPosition="none"
            skinTonePosition="none"
            categories={['people', 'nature', 'foods', 'activity', 'objects', 'symbols']}
            maxFrequentRows={2}
          />
        </div>
      )}
    </div>
  )
}
