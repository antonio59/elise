'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import LikeButton from '@/components/LikeButton'

export default function ExplorePage() {
  const [filter, setFilter] = useState<'all' | 'artwork' | 'review'>('all')

  const artworks: any[] = useQuery(api.artworks.getPublished, { limit: 20 }) ?? []
  const reviews: any[] = useQuery(api.reviews.getPublished, { limit: 20 }) ?? []

  const feed = [...artworks.map((a: any) => ({ type: 'artwork' as const, ...a })), 
                ...reviews.map((r: any) => ({ type: 'review' as const, ...r }))]
    .sort((a: any, b: any) => b.createdAt - a.createdAt)

  const filteredFeed = feed.filter(item => filter === 'all' || item.type === filter)

  const moodColors: Record<string, string> = {
    sakura: 'border-sakura-500',
    mint: 'border-mint-500',
    sky: 'border-sky-500',
    kawaii: 'border-kawaii-500',
    gold: 'border-gold-500',
    inkPink: 'border-sakura-500',
    inkLime: 'border-mint-500',
    inkCyan: 'border-sky-500',
    inkPurple: 'border-kawaii-500',
    inkYellow: 'border-gold-500'
  }

  const isLoading = artworks === undefined || reviews === undefined

  if (isLoading) {
    return (
      <main className="py-10">
        <h2 className="text-3xl font-semibold mb-6">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-xl" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-semibold">Explore</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-inkPink text-white' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('artwork')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'artwork' ? 'bg-inkLime text-inkBlack' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            Art
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'review' ? 'bg-inkPurple text-white' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {filteredFeed.length === 0 ? (
        <p className="text-neutral-500">No content to explore yet. Be the first to share!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeed.map(item => {
            if (item.type === 'artwork') {
              return (
                <Link key={item._id} href={`/artwork/${item._id}`} className="group">
                  <article className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img src={item.imageUrl} alt={item.title || 'Artwork'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.title || 'Untitled'}</h3>
                          {item.style && <p className="text-sm text-neutral-500">{item.style}</p>}
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-inkLime/20 text-inkLime dark:bg-inkLime/10">Art</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {item.user && (
                          <div className="flex items-center gap-2">
                            {item.user.avatarUrl ? (
                              <img src={item.user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs">👤</div>
                            )}
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.user.username || 'Anonymous'}</span>
                          </div>
                        )}
                        <div onClick={e => e.preventDefault()}>
                          <LikeButton contentId={item._id} contentType="artwork" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            } else {
              return (
                <Link key={item._id} href={`/review/${item._id}`} className="group">
                  <article className={`rounded-xl overflow-hidden border-2 ${moodColors[item.moodColor] || 'border-neutral-200'} bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow h-full`}>
                    <div className="p-4 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.bookTitle}</h3>
                          <p className="text-sm text-neutral-500">{item.author}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-inkPurple/20 text-inkPurple dark:bg-inkPurple/10">Review</span>
                      </div>
                      <div className="flex text-yellow-400 text-sm mb-3">
                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 flex-1 line-clamp-3">
                        {item.content}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        {item.user && (
                          <div className="flex items-center gap-2">
                            {item.user.avatarUrl ? (
                              <img src={item.user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs">👤</div>
                            )}
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.user.username || 'Anonymous'}</span>
                          </div>
                        )}
                        <div onClick={e => e.preventDefault()}>
                          <LikeButton contentId={item._id} contentType="review" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            }
          })}
        </div>
      )}
    </main>
  )
}
