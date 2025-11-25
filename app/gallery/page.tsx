'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import LikeButton from '@/components/LikeButton'

export default function GalleryPage() {
  const [tab, setTab] = useState<'all' | 'art' | 'reviews'>('all')

  const artworks: any[] = useQuery(api.artworks.getPublished, { limit: 50 }) ?? []
  const reviews: any[] = useQuery(api.reviews.getPublished, { limit: 50 }) ?? []

  const filteredArtworks: any[] = tab === 'reviews' ? [] : artworks
  const filteredReviews: any[] = tab === 'art' ? [] : reviews

  const moodColors: Record<string, string> = {
    inkPink: 'border-inkPink',
    inkLime: 'border-inkLime',
    inkCyan: 'border-inkCyan',
    inkPurple: 'border-inkPurple',
    inkYellow: 'border-inkYellow'
  }

  const isLoading = artworks === undefined || reviews === undefined

  if (isLoading) {
    return (
      <main className="py-10">
        <div className="skeleton h-10 w-48 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-xl" />)}
        </div>
      </main>
    )
  }

  return (
    <main className="py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-semibold">Gallery</h2>
        <div className="flex gap-2">
          <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'all' ? 'bg-inkPink text-white' : 'bg-neutral-100 dark:bg-neutral-800'}`}>All</button>
          <button onClick={() => setTab('art')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'art' ? 'bg-inkLime text-inkBlack' : 'bg-neutral-100 dark:bg-neutral-800'}`}>Art</button>
          <button onClick={() => setTab('reviews')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'reviews' ? 'bg-inkPurple text-white' : 'bg-neutral-100 dark:bg-neutral-800'}`}>Reviews</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map(a => (
          <Link key={a._id} href={`/artwork/${a._id}`} className="group">
            <article className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img src={a.imageUrl} alt={a.title || 'Artwork'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{a.title || 'Untitled'}</p>
                  <p className="text-sm text-neutral-500">{a.style || 'Art'}</p>
                </div>
                <div onClick={e => e.preventDefault()}>
                  <LikeButton contentId={a._id} contentType="artwork" />
                </div>
              </div>
            </article>
          </Link>
        ))}
        {filteredReviews.map(r => (
          <Link key={r._id} href={`/review/${r._id}`} className="group">
            <article className={`rounded-xl border-2 ${moodColors[r.moodColor] || 'border-neutral-200'} overflow-hidden bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow h-full`}>
              <div className="p-4 flex flex-col h-full">
                <div className="mb-2">
                  <p className="font-semibold">{r.bookTitle}</p>
                  <p className="text-sm text-neutral-500">{r.author}</p>
                </div>
                <div className="flex text-yellow-400 text-sm mb-2">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 flex-1 line-clamp-3">{r.content}</p>
                {r.imageUrl && (
                  <img src={r.imageUrl} alt="" className="mt-3 rounded-md max-h-32 object-cover" />
                )}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800" onClick={e => e.preventDefault()}>
                  <LikeButton contentId={r._id} contentType="review" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {filteredArtworks.length === 0 && filteredReviews.length === 0 && (
        <p className="text-center text-neutral-500 mt-10">No public posts yet. Be the first to share!</p>
      )}
    </main>
  )
}
