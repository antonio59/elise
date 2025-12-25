'use client'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import BookCard from '@/components/BookCard'
import { Doc } from '@/convex/_generated/dataModel'

export default function BookshelfPage() {
  const { token } = useAuth()
  const books = (useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? []) as Doc<'books'>[]

  const reading = books.filter((b: any) => b.status === 'reading')
  const read = books.filter((b: any) => b.status === 'read')
  const wishlist = books.filter((b: any) => b.status === 'wishlist')
  const favorites = books.filter((b: any) => b.isFavorite)
  const seriesGroups = groupBySeries(books)

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
          <h3 className="text-2xl font-medium mb-4 text-gold-500 flex items-center gap-2">⭐ Favorites</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map(book => (
              <BookCard
                key={book._id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                rating={book.rating || 0}
                status={book.status}
                isFavorite={book.isFavorite}
                genre={book.genre}
                progress={calculateProgress(book)}
                href={`/book/${book._id}`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h3 className="text-2xl font-medium mb-4 text-sakura-500">Currently Reading</h3>
        {reading.length === 0 ? <p className="text-neutral-500 dark:text-neutral-400">Not reading anything right now.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {reading.map(book => (
              <BookCard
                key={book._id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                rating={book.rating || 0}
                status={book.status}
                isFavorite={book.isFavorite}
                genre={book.genre}
                progress={calculateProgress(book)}
                href={`/book/${book._id}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-medium mb-4 text-sky-500">Read</h3>
        {read.length === 0 ? <p className="text-neutral-500 dark:text-neutral-400">No books finished yet.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {read.map(book => (
              <BookCard
                key={book._id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                rating={book.rating || 0}
                status={book.status}
                isFavorite={book.isFavorite}
                genre={book.genre}
                progress={calculateProgress(book)}
                href={`/book/${book._id}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-medium mb-4 text-kawaii-500">Wishlist</h3>
        {wishlist.length === 0 ? <p className="text-neutral-500 dark:text-neutral-400">Wishlist is empty.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {wishlist.map(book => (
              <BookCard
                key={book._id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                rating={book.rating || 0}
                status={book.status}
                isFavorite={book.isFavorite}
                genre={book.genre}
                progress={calculateProgress(book)}
                href={`/book/${book._id}`}
              />
            ))}
          </div>
        )}
      </section>

      {seriesGroups.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-medium mb-4 text-sky-500">Series</h3>
          <div className="space-y-4">
            {seriesGroups.map((group) => (
              <div key={group.series} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-neutral-500">Manga / Light Novel Series</p>
                    <h4 className="text-xl font-semibold">{group.series}</h4>
                  </div>
                  <span className="text-sm text-neutral-500">{group.books.length} books</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {group.books.map((book) => (
                    <BookCard
                      key={book._id}
                      title={book.title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      rating={book.rating || 0}
                      status={book.status}
                      genre={book.genre}
                      progress={calculateProgress(book)}
                      href={`/book/${book._id}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function calculateProgress(book: Doc<'books'>) {
  if (book.pagesTotal && book.pagesRead !== undefined) {
    return Math.round((book.pagesRead / book.pagesTotal) * 100)
  }
  return undefined
}

function groupBySeries(books: Doc<'books'>[]) {
  const map = new Map<string, Doc<'books'>[]>()
  books.forEach((book) => {
    if (book.series) {
      const key = book.series.trim()
      const arr = map.get(key) ?? []
      arr.push(book)
      map.set(key, arr)
    }
  })
  return Array.from(map.entries())
    .filter(([, list]) => list.length > 0)
    .map(([series, list]) => ({ series, books: list }))
}
