'use client'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'

export default function BookshelfPage() {
  const { token } = useAuth()
  const books: any[] = useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? []

  const reading = books.filter((b: any) => b.status === 'reading')
  const read = books.filter((b: any) => b.status === 'read')
  const wishlist = books.filter((b: any) => b.status === 'wishlist')
  const favorites = books.filter((b: any) => b.isFavorite)

  if (books === undefined) {
    return (
      <main className="py-10">
        <div className="skeleton h-10 w-48 rounded mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton aspect-[2/3] rounded-md" />)}
        </div>
      </main>
    )
  }

  return (
    <main className="py-10">
      <h2 className="text-3xl font-semibold mb-8">My Bookshelf</h2>

      {favorites.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-medium mb-4 text-inkYellow flex items-center gap-2">⭐ Favorites</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h3 className="text-2xl font-medium mb-4 text-inkPink">Currently Reading</h3>
        {reading.length === 0 ? <p className="text-neutral-500 dark:text-neutral-400">Not reading anything right now.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {reading.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-medium mb-4 text-inkCyan">Read</h3>
        {read.length === 0 ? <p className="text-neutral-500 dark:text-neutral-400">No books finished yet.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {read.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-medium mb-4 text-inkPurple">Wishlist</h3>
        {wishlist.length === 0 ? <p className="text-neutral-500 dark:text-neutral-400">Wishlist is empty.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {wishlist.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </section>
    </main>
  )
}

function BookCard({ book }: { book: any }) {
  const progress = book.pagesTotal && book.pagesRead ? Math.round((book.pagesRead / book.pagesTotal) * 100) : 0
  
  return (
    <Link href={`/book/${book._id}`} className="group relative flex flex-col gap-2">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 shadow-sm transition-transform group-hover:-translate-y-1">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400 text-4xl">📚</div>
        )}
        {book.isFavorite && (
          <div className="absolute top-2 right-2 text-xl">⭐</div>
        )}
      </div>
      {book.status === 'reading' && book.pagesTotal && book.pagesTotal > 0 && (
        <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div className="h-full bg-inkLime rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div>
        <h4 className="font-medium leading-tight">{book.title}</h4>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{book.author}</p>
        {book.genre && <p className="text-xs text-inkPurple mt-1">{book.genre}</p>}
        {book.rating !== undefined && book.rating !== null && (
          <div className="mt-1 flex text-yellow-400 text-sm">
            {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
          </div>
        )}
      </div>
    </Link>
  )
}
