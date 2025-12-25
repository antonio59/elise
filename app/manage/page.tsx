'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'

export default function ManagePage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'artworks' | 'reviews' | 'books'>('artworks')
  const [message, setMessage] = useState('')

  const artworks: any[] = useQuery(api.artworks.getAllArtworks, token ? { token } : "skip") ?? []
  const reviews: any[] = useQuery(api.reviews.getAllReviews, token ? { token } : "skip") ?? []
  const books: any[] = useQuery(api.books.getAllBooks, token ? { token } : "skip") ?? []

  const updateArtwork = useMutation(api.artworks.update)
  const deleteArtwork = useMutation(api.artworks.remove)
  const updateReview = useMutation(api.reviews.update)
  const deleteReview = useMutation(api.reviews.remove)
  const deleteBook = useMutation(api.books.remove)

  if (loading) {
    return (
      <main className="py-10">
        <div className="skeleton h-10 w-64 rounded mb-6" />
        <div className="skeleton h-96 rounded-xl" />
      </main>
    )
  }

  if (!user || user.role !== 'parent') {
    router.push('/dashboard')
    return null
  }

  const togglePublished = async (type: 'artwork' | 'review', id: string, current: boolean) => {
    if (!token) return
    if (type === 'artwork') {
      await updateArtwork({ token, artworkId: id as any, published: !current })
    } else {
      await updateReview({ token, reviewId: id as any, published: !current })
    }
    setMessage(`${type} ${!current ? 'published' : 'hidden'}`)
    setTimeout(() => setMessage(''), 2000)
  }

  const deleteItem = async (type: 'artwork' | 'review' | 'book', id: string) => {
    if (!token || !confirm(`Are you sure you want to delete this ${type}?`)) return
    if (type === 'artwork') {
      await deleteArtwork({ token, artworkId: id as any })
    } else if (type === 'review') {
      await deleteReview({ token, reviewId: id as any })
    } else {
      await deleteBook({ token, bookId: id as any })
    }
    setMessage(`${type} deleted`)
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <main className="py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold">Parent Dashboard</h2>
          <p className="text-neutral-500 mt-1">Manage all content on the platform</p>
        </div>
        {message && (
          <span className="px-4 py-2 rounded-full bg-mint-500/20 text-mint-600 text-sm font-medium">
            {message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Total Artworks</p>
          <p className="text-3xl font-bold text-mint-600">{artworks.length}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {artworks.filter(a => a.published).length} published
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Total Reviews</p>
          <p className="text-3xl font-bold text-sakura-600">{reviews.length}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {reviews.filter(r => r.published).length} published
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Total Books</p>
          <p className="text-3xl font-bold text-kawaii-600">{books.length}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {books.filter(b => b.status === 'read').length} completed
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 mb-6">
        <button
          onClick={() => setTab('artworks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'artworks' ? 'border-mint-500 text-mint-600' : 'border-transparent text-neutral-500'
          }`}
        >
          Artworks ({artworks.length})
        </button>
        <button
          onClick={() => setTab('reviews')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'reviews' ? 'border-sakura-500 text-sakura-600' : 'border-transparent text-neutral-500'
          }`}
        >
          Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setTab('books')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'books' ? 'border-kawaii-500 text-kawaii-600' : 'border-transparent text-neutral-500'
          }`}
        >
          Books ({books.length})
        </button>
      </div>

      {tab === 'artworks' && (
        <div className="space-y-3">
          {artworks.length === 0 ? (
            <p className="text-neutral-500">No artworks yet.</p>
          ) : (
            artworks.map(art => (
              <div key={art._id} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <img src={art.imageUrl} alt="" className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{art.title || 'Untitled'}</p>
                  <p className="text-sm text-neutral-500">{art.style || 'Art'} - {new Date(art.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    art.published ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {art.published ? 'Public' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => togglePublished('artwork', art._id, art.published)}
                    className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    {art.published ? 'Hide' : 'Publish'}
                  </button>
                  <Link href={`/artwork/${art._id}`} className="px-3 py-1 rounded-md bg-sky-500 text-white text-sm">
                    View
                  </Link>
                  <button
                    onClick={() => deleteItem('artwork', art._id)}
                    className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-neutral-500">No reviews yet.</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="w-16 h-16 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl">
                  ✍️
                </div>
                <div className="flex-1">
                  <p className="font-medium">{review.bookTitle}</p>
                  <p className="text-sm text-neutral-500">{review.author} - {new Date(review.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{review.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.published ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {review.published ? 'Public' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => togglePublished('review', review._id, review.published)}
                    className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    {review.published ? 'Hide' : 'Publish'}
                  </button>
                  <Link href={`/review/${review._id}`} className="px-3 py-1 rounded-md bg-sky-500 text-white text-sm">
                    View
                  </Link>
                  <button
                    onClick={() => deleteItem('review', review._id)}
                    className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'books' && (
        <div className="space-y-3">
          {books.length === 0 ? (
            <p className="text-neutral-500">No books yet.</p>
          ) : (
            books.map(book => (
              <div key={book._id} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="w-12 h-16 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📚</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-neutral-500">{book.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.status === 'read' ? 'bg-sky-500/20 text-sky-600' : 
                    book.status === 'reading' ? 'bg-sakura-500/20 text-sakura-600' : 'bg-kawaii-500/20 text-kawaii-600'
                  }`}>
                    {book.status === 'read' ? 'Read' : book.status === 'reading' ? 'Reading' : 'Wishlist'}
                  </span>
                  {book.genre && <span className="text-xs text-neutral-500">{book.genre}</span>}
                  <Link href={`/book/${book._id}`} className="px-3 py-1 rounded-md bg-sky-500 text-white text-sm">
                    View
                  </Link>
                  <button
                    onClick={() => deleteItem('book', book._id)}
                    className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  )
}
