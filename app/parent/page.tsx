'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import ReadingGoal from '@/components/ReadingGoal'
import ReadingCalendar from '@/components/ReadingCalendar'

export default function ParentDashboard() {
  const router = useRouter()
  const { user, token, loading } = useAuth()

  const stats = useQuery(api.users.getMyStats, token ? { token } : "skip")
  const books = useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? []
  const reviews = useQuery(api.reviews.getMyReviews, token ? { token } : "skip") ?? []
  const artworks = useQuery(api.artworks.getMyArtworks, token ? { token } : "skip") ?? []
  const goal = useQuery(api.goals.getCurrentGoal, token ? { token } : "skip")

  if (loading) {
    return (
      <main className="py-10">
        <div className="animate-pulse">Loading...</div>
      </main>
    )
  }

  if (!user || user.role !== 'parent') {
    return (
      <main className="py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>
          <p className="text-neutral-500 mb-4">This page is for parent accounts only.</p>
          <Link href="/dashboard" className="text-inkPink hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  const recentBooks = books.slice(0, 5)
  const recentReviews = reviews.slice(0, 5)
  const recentArtworks = artworks.slice(0, 6)

  const booksThisMonth = books.filter((b) => {
    if (!b.createdAt) return false
    const bookDate = new Date(b.createdAt)
    const now = new Date()
    return bookDate.getMonth() === now.getMonth() && bookDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <main className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-neutral-500 mt-1">Monitor reading progress and activity</p>
        </div>
        <Link
          href="/manage"
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
        >
          Manage Content
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Books Read</p>
          <p className="text-3xl font-bold text-inkPurple">{stats?.booksRead ?? 0}</p>
          <p className="text-xs text-neutral-400 mt-1">+{booksThisMonth} this month</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Total Pages</p>
          <p className="text-3xl font-bold text-inkCyan">{(stats?.totalPages ?? 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Reviews Written</p>
          <p className="text-3xl font-bold text-inkPink">{reviews.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Reading Streak</p>
          <p className="text-3xl font-bold text-orange-500">{stats?.streak ?? 0} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reading Goal Progress */}
          <ReadingGoal />

          {/* Reading Calendar */}
          <ReadingCalendar />

          {/* Recent Books */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <h3 className="font-medium mb-4">📚 Recent Books</h3>
            {recentBooks.length === 0 ? (
              <p className="text-sm text-neutral-500">No books added yet</p>
            ) : (
              <div className="space-y-3">
                {recentBooks.map((book: any) => (
                  <Link
                    key={book._id}
                    href={`/book/${book._id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt="" className="w-10 h-14 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-14 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">📖</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{book.title}</p>
                      <p className="text-sm text-neutral-500">{book.author}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      book.status === 'read' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      book.status === 'reading' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}>
                      {book.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <h3 className="font-medium mb-4">✍️ Recent Reviews</h3>
            {recentReviews.length === 0 ? (
              <p className="text-sm text-neutral-500">No reviews written yet</p>
            ) : (
              <div className="space-y-3">
                {recentReviews.map((review: any) => (
                  <Link
                    key={review._id}
                    href={`/review/${review._id}`}
                    className="block p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{review.bookTitle}</p>
                      <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-2">{review.content}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Genre Breakdown */}
          {stats?.genreStats && Object.keys(stats.genreStats).length > 0 && (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <h3 className="font-medium mb-4">🏷️ Reading Interests</h3>
              <div className="space-y-3">
                {Object.entries(stats.genreStats as Record<string, number>)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([genre, count]) => (
                    <div key={genre}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{genre}</span>
                        <span className="text-neutral-500">{count} books</span>
                      </div>
                      <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(count / books.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Artworks */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <h3 className="font-medium mb-4">🎨 Recent Artwork</h3>
            {recentArtworks.length === 0 ? (
              <p className="text-sm text-neutral-500">No artwork uploaded yet</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {recentArtworks.map((art: any) => (
                  <Link
                    key={art._id}
                    href={`/artwork/${art._id}`}
                    className="aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800"
                  >
                    <img src={art.imageUrl} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <h3 className="font-medium mb-4">⚡ Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block w-full px-4 py-2 rounded-lg bg-inkLime/10 text-inkLime text-center text-sm font-medium hover:bg-inkLime/20 transition-colors"
              >
                Add New Book
              </Link>
              <Link
                href="/write"
                className="block w-full px-4 py-2 rounded-lg bg-inkPink/10 text-inkPink text-center text-sm font-medium hover:bg-inkPink/20 transition-colors"
              >
                Write Review
              </Link>
              <Link
                href="/gallery"
                className="block w-full px-4 py-2 rounded-lg bg-emerald-500/10 text-inkPurple text-center text-sm font-medium hover:bg-emerald-500/20 transition-colors"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
