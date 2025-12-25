'use client'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import { useRouter } from 'next/navigation'
import ArtCard, { ArtCardSkeleton } from '@/components/ArtCard'
import { Id } from '@/convex/_generated/dataModel'

export default function GalleryPage() {
  const router = useRouter()
  const artworks = useQuery(api.artworks.getPublished, {}) ?? []

  return (
    <main>
      {/* Hero Section with mint background */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
            My Art Gallery <span className="inline-block">🎨</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Here are some sketches, doodles, and finished pieces I’ve been working on!
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {artworks === undefined ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ArtCardSkeleton key={i} />
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-gray-500 text-lg">No artwork yet!</p>
              <p className="text-gray-400 mt-2">Add your first piece in the Admin section</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <ArtCard
                  key={artwork._id}
                  title={artwork.title || 'Untitled'}
                  imageUrl={artwork.imageUrl}
                  style={artwork.style}
                  onClick={() => router.push(`/artwork/${artwork._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
