'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import { searchBooks } from '@/lib/bookCover'

type ExternalBook = {
  title: string
  author: string
  coverUrl: string | null
  year?: number
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [externalBooks, setExternalBooks] = useState<ExternalBook[]>([])
  const [loadingExternal, setLoadingExternal] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'reviews' | 'artworks' | 'books'>('all')

  const results = useQuery(
    api.search.searchAll,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setLoadingExternal(true)
      searchBooks(debouncedQuery).then((books) => {
        setExternalBooks(books)
        setLoadingExternal(false)
      })
    } else {
      setExternalBooks([])
    }
  }, [debouncedQuery])

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'users', label: 'Users', count: results?.users.length },
    { key: 'reviews', label: 'Reviews', count: results?.reviews.length },
    { key: 'artworks', label: 'Artworks', count: results?.artworks.length },
    { key: 'books', label: 'Find Books', count: externalBooks.length },
  ]

  return (
    <>
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users, reviews, artworks, or find new books..."
          className="w-full px-4 py-3 pl-12 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-lg"
          autoFocus
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-inkPink text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 opacity-70">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {debouncedQuery.length < 2 ? (
        <p className="text-center text-neutral-500 py-10">
          Type at least 2 characters to search
        </p>
      ) : (
        <div className="space-y-6">
          {(activeTab === 'all' || activeTab === 'users') && results?.users && results.users.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-neutral-500 mb-3">Users</h2>
              <div className="space-y-2">
                {results.users.map((user) => (
                  <Link
                    key={user._id}
                    href={`/user/${user._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">👤</div>
                    )}
                    <div>
                      <p className="font-medium">{user.title}</p>
                      {user.subtitle && <p className="text-sm text-neutral-500 line-clamp-1">{user.subtitle}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'reviews') && results?.reviews && results.reviews.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-neutral-500 mb-3">Reviews</h2>
              <div className="space-y-2">
                {results.reviews.map((review) => (
                  <Link
                    key={review._id}
                    href={`/review/${review._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {review.imageUrl ? (
                      <img src={review.imageUrl} alt="" className="w-12 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-16 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">📚</div>
                    )}
                    <div>
                      <p className="font-medium">{review.title}</p>
                      <p className="text-sm text-neutral-500">{review.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'artworks') && results?.artworks && results.artworks.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-neutral-500 mb-3">Artworks</h2>
              <div className="grid grid-cols-3 gap-3">
                {results.artworks.map((artwork) => (
                  <Link
                    key={artwork._id}
                    href={`/artwork/${artwork._id}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="mt-1 text-sm font-medium truncate">{artwork.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'books') && (
            <section>
              <h2 className="text-sm font-medium text-neutral-500 mb-3">
                Find New Books {loadingExternal && '(searching...)'}
              </h2>
              {externalBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {externalBooks.map((book, i) => (
                    <div key={i} className="group">
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                        )}
                      </div>
                      <p className="mt-2 font-medium text-sm line-clamp-2">{book.title}</p>
                      <p className="text-xs text-neutral-500">{book.author}{book.year ? ` (${book.year})` : ''}</p>
                    </div>
                  ))}
                </div>
              ) : !loadingExternal && debouncedQuery.length >= 2 ? (
                <p className="text-sm text-neutral-500">No books found</p>
              ) : null}
            </section>
          )}

          {results && 
            results.users.length === 0 && 
            results.reviews.length === 0 && 
            results.artworks.length === 0 && 
            externalBooks.length === 0 &&
            !loadingExternal && (
            <p className="text-center text-neutral-500 py-10">
              No results found for “{debouncedQuery}”
            </p>
          )}
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <main className="py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <SearchContent />
        </Suspense>
      </div>
    </main>
  )
}
