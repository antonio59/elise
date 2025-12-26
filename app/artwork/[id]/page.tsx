'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '@/convex/_generated/dataModel'
import EngagementButtons from '@/components/EngagementButtons'
import { useState } from 'react'

export default function ArtworkDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const [lightbox, setLightbox] = useState(false)
  const artwork = useQuery(api.artworks.getById, { artworkId: id as Id<"artworks">, token: token ?? undefined })

  if (artwork === undefined) {
    return (
      <main className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-32 mb-6" />
          <div className="skeleton aspect-square max-w-2xl rounded-2xl" />
        </div>
      </main>
    )
  }

  if (!artwork) {
    return (
      <main className="py-10 px-4 text-center">
        <p className="text-gray-500">Artwork not found.</p>
        <Link href="/gallery" className="text-pink-600 hover:underline mt-4 inline-block">Go to Gallery</Link>
      </main>
    )
  }

  return (
    <main className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/gallery" className="text-sm text-gray-500 hover:text-pink-600 mb-6 inline-block">
          ← Back to Gallery
        </Link>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-lg overflow-hidden cursor-zoom-in" onClick={() => setLightbox(true)}>
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title || 'Artwork'} 
            className="w-full transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900">{artwork.title || 'Untitled'}</h1>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {artwork.style && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                {artwork.style}
              </span>
            )}
            {artwork.dateDrawn && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                📅 {new Date(artwork.dateDrawn).toLocaleDateString()}
              </span>
            )}
          </div>

          {artwork.thoughts && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-900 mb-2">My Thoughts</h3>
              <p className="text-gray-600 italic">“{artwork.thoughts}”</p>
            </div>
          )}

          {/* Engagement Buttons */}
          <div className="mt-6">
            <EngagementButtons contentId={artwork._id} contentType="artwork" />
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Added on {new Date(artwork.createdAt).toLocaleDateString()}
          </p>
        </div>

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setLightbox(false)}>
          <div className="max-w-5xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img src={artwork.imageUrl} alt={artwork.title || 'Artwork'} className="w-full h-full object-contain rounded-2xl shadow-2xl" />
          </div>
          <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 text-white text-3xl">×</button>
        </div>
      )}
      </div>
    </main>
  )
}
