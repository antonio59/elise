'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '../../../convex/_generated/dataModel'
import BookForm from '@/components/BookForm'
import { useState } from 'react'

export default function BookDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const book = useQuery(api.books.getById, { bookId: id as Id<"books"> })
  const reviews = useQuery(api.reviews.getByBookTitle, book ? { bookTitle: book.title } : "skip") ?? []
  const deleteBook = useMutation(api.books.remove)
  const toggleFavorite = useMutation(api.books.toggleFavorite)

  const isOwner = user && book && user._id === book.userId

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book?') || !token) return
    setDeleting(true)
    await deleteBook({ token, bookId: id as Id<"books"> })
    router.push('/bookshelf')
  }

  const handleToggleFavorite = async () => {
    if (!token || !book) return
    await toggleFavorite({ token, bookId: book._id })
  }

  if (book === undefined) return <main className="py-10"><div className="skeleton h-8 w-48 rounded mb-4" /><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="skeleton aspect-[2/3] rounded-lg" /></div></main>
  if (!book) return <main className="py-10"><p>Book not found. <Link href="/bookshelf" className="text-inkPink">Back to bookshelf</Link></p></main>

  if (editing) {
    return (
      <main className="py-10">
        <button onClick={() => setEditing(false)} className="text-sm text-inkPink mb-4">&larr; Cancel</button>
        <h2 className="text-2xl font-semibold mb-6">Edit Book</h2>
        <div className="max-w-xl"><BookForm book={book} onSaved={() => setEditing(false)} /></div>
      </main>
    )
  }

  const progress = book.pagesTotal && book.pagesRead ? Math.round((book.pagesRead / book.pagesTotal) * 100) : 0

  return (
    <main className="py-10">
      <Link href="/bookshelf" className="text-sm text-neutral-500 hover:text-inkPink mb-4 inline-block">&larr; Back</Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <div>
          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg">
            {book.coverUrl ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-6xl text-neutral-400">📚</div>}
          </div>
          {isOwner && <div className="flex gap-2 mt-4"><button onClick={() => setEditing(true)} className="flex-1 rounded-md bg-inkCyan text-white px-4 py-2 text-sm">Edit</button><button onClick={handleDelete} disabled={deleting} className="flex-1 rounded-md bg-red-500 text-white px-4 py-2 text-sm disabled:opacity-50">{deleting ? '...' : 'Delete'}</button></div>}
        </div>
        <div className="md:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div><h1 className="text-3xl font-bold">{book.title}</h1><p className="text-lg text-neutral-600 dark:text-neutral-400 mt-1">by {book.author}</p></div>
            {isOwner && <button onClick={handleToggleFavorite} className="text-3xl transition-transform hover:scale-110">{book.isFavorite ? '⭐' : '☆'}</button>}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${book.status === 'reading' ? 'bg-inkPink text-white' : book.status === 'read' ? 'bg-inkCyan text-white' : 'bg-inkPurple text-white'}`}>{book.status === 'reading' ? 'Currently Reading' : book.status === 'read' ? 'Read' : 'Wishlist'}</span>
            {book.genre && <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 dark:bg-neutral-800">{book.genre}</span>}
          </div>
          {book.rating && <div className="mt-4 flex text-yellow-400 text-2xl">{'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</div>}
          {book.pagesTotal && book.pagesTotal > 0 && (
            <div className="mt-6"><div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{book.pagesRead || 0} / {book.pagesTotal} pages ({progress}%)</span></div><div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"><div className="h-full bg-inkLime transition-all duration-300" style={{ width: `${progress}%` }} /></div></div>
          )}
          {book.finishedAt && <p className="mt-4 text-sm text-neutral-500">Finished on {new Date(book.finishedAt).toLocaleDateString()}</p>}
          {reviews.length > 0 && (
            <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6"><h2 className="text-xl font-semibold mb-4">Reviews</h2><div className="space-y-4">{reviews.map((review: any) => (<Link key={review._id} href={`/review/${review._id}`} className="block p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"><div className="flex items-center gap-2 mb-2"><div className="flex text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div><span className="text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</span></div><p className="text-sm">{review.content?.slice(0, 200)}{review.content && review.content.length > 200 ? '...' : ''}</p></Link>))}</div></div>
          )}
        </div>
      </div>
    </main>
  )
}
