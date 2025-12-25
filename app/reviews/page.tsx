'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import LikeButton from '@/components/LikeButton'

const moodBadges: Record<string, string> = {
  sakura: 'bg-sakura-100 text-sakura-700',
  mint: 'bg-mint-100 text-mint-700',
  sky: 'bg-sky-100 text-sky-700',
  kawaii: 'bg-kawaii-100 text-kawaii-700',
  gold: 'bg-gold-100 text-gold-700',
}

export default function ReviewsGalleryPage() {
  const [minRating, setMinRating] = useState(0)
  const reviews = useQuery(api.reviews.getPublished, { limit: 60 })

  const filtered = useMemo(
    () => (reviews ?? []).filter((r: any) => (minRating ? r.rating >= minRating : true)),
    [reviews, minRating]
  )

  const isLoading = reviews === undefined

  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-neutral-500 uppercase tracking-wide">Reviews</p>
            <h1 className="text-3xl font-black">Public Reading Diary</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-600">Min rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            >
              <option value={0}>All</option>
              {[3, 4, 5].map((r) => (
                <option key={r} value={r}>{r}★ & up</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">No reviews yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((review: any) => (
              <Link key={review._id} href={`/review/${review._id}`} className="group">
                <article className="h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{review.bookTitle}</h3>
                      <p className="text-sm text-neutral-500">{review.author}</p>
                    </div>
                    <div className="flex text-yellow-400 text-sm">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">{review.content}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      {review.user?.avatarUrl ? (
                        <img src={review.user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs">👤</div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{review.user?.username || 'Anonymous'}</p>
                        <p className="text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div onClick={(e) => e.preventDefault()}>
                      <LikeButton contentId={review._id} contentType="review" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${moodBadges[review.moodColor] || 'bg-neutral-100 text-neutral-600'}`}>
                      {review.moodColor || 'mood'}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
