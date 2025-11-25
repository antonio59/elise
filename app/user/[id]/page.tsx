'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '../../../convex/_generated/dataModel'
import FollowButton from '@/components/FollowButton'

export default function UserProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [tab, setTab] = useState<'art' | 'reviews' | 'books'>('art')

  const profile: any = useQuery(api.users.getById, { userId: id as Id<"users"> })
  const stats: any = useQuery(api.users.getStats, { userId: id as Id<"users"> })
  const artworks: any[] = useQuery(api.artworks.getByUser, { userId: id as Id<"users">, publishedOnly: true }) ?? []
  const reviews: any[] = useQuery(api.reviews.getByUser, { userId: id as Id<"users">, publishedOnly: true }) ?? []
  const books: any[] = useQuery(api.books.getByUser, { userId: id as Id<"users"> }) ?? []

  const isOwnProfile = user?._id === id

  if (profile === undefined) return <main className="py-10"><div className="flex items-center gap-6 mb-8"><div className="skeleton w-24 h-24 rounded-full" /><div className="space-y-2"><div className="skeleton h-8 w-48 rounded" /></div></div></main>
  if (!profile) return <main className="py-10"><p>User not found.</p></main>

  return (
    <main className="py-10">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>}
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div><h1 className="text-2xl font-bold">{profile.username || 'Anonymous'}</h1>{profile.bio && <p className="text-neutral-600 dark:text-neutral-400 mt-1">{profile.bio}</p>}</div>
            {!isOwnProfile && user && <FollowButton userId={id as Id<"users">} />}
            {isOwnProfile && <Link href="/profile" className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700">Edit Profile</Link>}
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div><span className="font-semibold">{stats?.followers ?? 0}</span><span className="text-neutral-500 ml-1">followers</span></div>
            <div><span className="font-semibold">{stats?.following ?? 0}</span><span className="text-neutral-500 ml-1">following</span></div>
            <div><span className="font-semibold">{artworks.length}</span><span className="text-neutral-500 ml-1">artworks</span></div>
            <div><span className="font-semibold">{reviews.length}</span><span className="text-neutral-500 ml-1">reviews</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 mb-6">
        <button onClick={() => setTab('art')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'art' ? 'border-inkLime text-inkLime' : 'border-transparent text-neutral-500'}`}>Art ({artworks.length})</button>
        <button onClick={() => setTab('reviews')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'reviews' ? 'border-inkPink text-inkPink' : 'border-transparent text-neutral-500'}`}>Reviews ({reviews.length})</button>
        <button onClick={() => setTab('books')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'books' ? 'border-inkPurple text-inkPurple' : 'border-transparent text-neutral-500'}`}>Books ({books.length})</button>
      </div>

      {tab === 'art' && (artworks.length === 0 ? <p className="text-neutral-500">No public artworks yet.</p> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{artworks.map(art => (<Link key={art._id} href={`/artwork/${art._id}`} className="group"><div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800"><img src={art.imageUrl} alt={art.title || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div><p className="mt-2 text-sm font-medium truncate">{art.title || 'Untitled'}</p></Link>))}</div>)}

      {tab === 'reviews' && (reviews.length === 0 ? <p className="text-neutral-500">No public reviews yet.</p> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{reviews.map(review => (<Link key={review._id} href={`/review/${review._id}`} className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-inkPink"><h3 className="font-semibold">{review.bookTitle}</h3><p className="text-sm text-neutral-500">{review.author}</p><div className="flex text-yellow-400 text-sm my-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div><p className="text-sm line-clamp-2">{review.content}</p></Link>))}</div>)}

      {tab === 'books' && (books.length === 0 ? <p className="text-neutral-500">No books on shelf yet.</p> : <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">{books.map(book => (<Link key={book._id} href={`/book/${book._id}`} className="group"><div className="aspect-[2/3] rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm group-hover:-translate-y-1 transition-transform">{book.coverUrl ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-neutral-400">📚</div>}</div><p className="mt-2 text-xs font-medium truncate">{book.title}</p></Link>))}</div>)}
    </main>
  )
}
