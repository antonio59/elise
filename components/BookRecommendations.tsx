'use client'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import Link from 'next/link'

export default function BookRecommendations() {
  const { token } = useAuth()
  const recommendations = useQuery(api.search.getRecommendations, token ? { token } : "skip")

  if (!recommendations || recommendations.popular.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">✨ Recommended For You</h4>
        {recommendations.topGenres && recommendations.topGenres.length > 0 && (
          <div className="flex gap-1">
            {recommendations.topGenres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs px-2 py-0.5 rounded-full bg-inkPurple/10 text-inkPurple">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {recommendations.popular.slice(0, 6).map((book, i) => (
          <div key={i} className="group">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.bookTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>
              )}
            </div>
            <p className="mt-2 text-sm font-medium line-clamp-2">{book.bookTitle}</p>
            <p className="text-xs text-neutral-500">{book.author}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-xs text-neutral-500">{book.avgRating.toFixed(1)}</span>
              <span className="text-xs text-neutral-400">({book.reviewCount} reviews)</span>
            </div>
          </div>
        ))}
      </div>

      <Link 
        href="/explore" 
        className="block text-center mt-4 text-sm text-inkPink hover:underline"
      >
        See more reviews →
      </Link>
    </div>
  )
}
