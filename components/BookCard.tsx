'use client'

import Link from 'next/link'

type BookCardProps = {
  title: string
  author: string
  coverUrl?: string | null
  rating?: number
  review?: string
  progress?: number
  genre?: string | null
  status?: 'reading' | 'read' | 'wishlist'
  isFavorite?: boolean
  href?: string
  onClick?: () => void
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="star-rating">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function BookCard(props: BookCardProps) {
  const {
    title,
    author,
    coverUrl,
    rating = 0,
    review,
    progress,
    genre,
    status,
    isFavorite,
    href,
    onClick,
  } = props

  const computedProgress = progress ?? (status === 'read' ? 100 : progressFromStatus(status))

  const cardContent = (
    <div className="card cursor-pointer group h-full">
      <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-sakura-50 to-kawaii-50 relative">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
        )}
        {isFavorite && (
          <div className="absolute top-2 right-2 text-xl drop-shadow">⭐</div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">{title}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">{author}</p>
          </div>
          {genre && <span className="px-2 py-1 rounded-full text-xs bg-sakura-100 text-sakura-700 dark:bg-sakura-900/30 dark:text-sakura-200">{genre}</span>}
        </div>

        {status && (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badgeClass(status)}`}>
            {status === 'read' ? '✓ Read' : status === 'reading' ? 'Reading' : 'Wishlist'}
          </span>
        )}

        {rating > 0 && (
          <div className="mt-1">
            <StarRating rating={rating} />
          </div>
        )}

        {review && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300 italic line-clamp-2">
            “{review}”
          </p>
        )}

        {computedProgress !== undefined && (
          <div className="mt-2 progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${computedProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full" onClick={onClick}>
        {cardContent}
      </Link>
    )
  }

  return (
    <div className="h-full" onClick={onClick}>
      {cardContent}
    </div>
  )
}

function progressFromStatus(status?: 'reading' | 'read' | 'wishlist') {
  if (status === 'read') return 100
  if (status === 'reading') return 40
  return 0
}

function badgeClass(status: 'reading' | 'read' | 'wishlist') {
  if (status === 'read') return 'bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-200'
  if (status === 'reading') return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200'
  return 'bg-kawaii-100 text-kawaii-700 dark:bg-kawaii-900/30 dark:text-kawaii-200'
}

export function BookCardSkeleton() {
  return (
    <div className="card">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-full mt-3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-1 w-full mt-4" />
      </div>
    </div>
  )
}
