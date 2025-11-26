'use client'
import { useState } from 'react'
import { RATING_TYPES, RatingType } from '@/lib/types'

interface RatingPickerProps {
  value: number
  onChange: (value: number) => void
  ratingType: RatingType
  onTypeChange?: (type: RatingType) => void
  showTypeSelector?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function RatingPicker({
  value,
  onChange,
  ratingType,
  onTypeChange,
  showTypeSelector = false,
  size = 'md'
}: RatingPickerProps) {
  const [isSelectingType, setIsSelectingType] = useState(false)
  const config = RATING_TYPES[ratingType]
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  return (
    <div className="space-y-2">
      {showTypeSelector && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSelectingType(!isSelectingType)}
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
          >
            Rating style: {config.icon} {config.label}
            <span className="text-xs">▼</span>
          </button>
          
          {isSelectingType && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-2 z-10 min-w-[200px]">
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(RATING_TYPES) as RatingType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onTypeChange?.(type)
                      setIsSelectingType(false)
                    }}
                    className={`flex flex-col items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                      ratingType === type ? 'bg-neutral-100 dark:bg-neutral-700 ring-2 ring-inkPink' : ''
                    }`}
                  >
                    <span className="text-2xl">{RATING_TYPES[type].icon}</span>
                    <span className="text-xs mt-1">{RATING_TYPES[type].label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-1">
        {Array.from({ length: config.max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star === value ? 0 : star)}
            className={`${sizeClasses[size]} transition-transform hover:scale-110 active:scale-95`}
          >
            {star <= value ? config.icon : config.empty}
          </button>
        ))}
      </div>
    </div>
  )
}
