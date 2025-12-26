'use client'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import ArtUpload from '@/components/ArtUpload'
import BookForm from '@/components/BookForm'
import ReviewEditor from '@/components/ReviewEditor'
import ReadingGoal from '@/components/ReadingGoal'
import BookRecommendations from '@/components/BookRecommendations'
import { useState } from 'react'

type Achievement = {
  key: string
  title: string
  icon: string
  description: string
  earned: boolean
  color: string
}

export default function DashboardPage() {
  const { user, token, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'art' | 'book' | 'review'>('art')

  const stats: any = useQuery(api.users.getMyStats, token ? { token } : "skip")
  const artworks: any[] = useQuery(api.artworks.getMyArtworks, token ? { token } : "skip") ?? []
  const reviews: any[] = useQuery(api.reviews.getMyReviews, token ? { token } : "skip") ?? []
  const books: any[] = useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? []

  const booksRead = stats?.booksRead ?? 0
  const booksReading = stats?.booksReading ?? 0
  const totalPages = stats?.totalPages ?? 0
  const favorites = stats?.favorites ?? 0
  const streak = stats?.streak ?? 0
  const genreStats: Record<string, number> = stats?.genreStats ?? {}
  const topGenre = Object.entries(genreStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet'

  const achievements: Achievement[] = [
    { key: 'first_steps', title: 'First Steps', icon: '🌟', description: 'Add your first book or artwork', earned: booksRead > 0 || artworks.length > 0, color: 'yellow' },
    { key: 'bookworm', title: 'Bookworm', icon: '📚', description: 'Read 5 books', earned: booksRead >= 5, color: 'blue' },
    { key: 'avid_reader', title: 'Avid Reader', icon: '📖', description: 'Read 10 books', earned: booksRead >= 10, color: 'indigo' },
    { key: 'library_master', title: 'Library Master', icon: '🏰', description: 'Read 25 books', earned: booksRead >= 25, color: 'emerald' },
    { key: 'artiste', title: 'Artiste', icon: '🎨', description: 'Upload 5 artworks', earned: artworks.length >= 5, color: 'lime' },
    { key: 'gallery_owner', title: 'Gallery Owner', icon: '🖼️', description: 'Upload 15 artworks', earned: artworks.length >= 15, color: 'green' },
    { key: 'critic', title: 'Critic', icon: '✍️', description: 'Write 5 reviews', earned: reviews.length >= 5, color: 'pink' },
    { key: 'review_pro', title: 'Review Pro', icon: '📝', description: 'Write 15 reviews', earned: reviews.length >= 15, color: 'rose' },
    { key: 'manga_master', title: 'Manga Master', icon: '🗾', description: 'Read 5 manga/webtoons', earned: books.filter(b => b.genre === 'Manga' || b.genre === 'Webtoon').length >= 5, color: 'cyan' },
    { key: 'isekai_fan', title: 'Isekai Fan', icon: '🌀', description: 'Read 3 Isekai books', earned: books.filter(b => b.genre === 'Isekai').length >= 3, color: 'violet' },
    { key: 'page_turner', title: 'Page Turner', icon: '📄', description: 'Read 1000 pages', earned: totalPages >= 1000, color: 'amber' },
    { key: 'bookshelf_builder', title: 'Bookshelf Builder', icon: '📕', description: 'Add 20 books to shelf', earned: books.length >= 20, color: 'red' },
    { key: 'streak_starter', title: 'Streak Starter', icon: '🔥', description: '3-day reading streak', earned: streak >= 3, color: 'orange' },
    { key: 'dedicated_reader', title: 'Dedicated Reader', icon: '💪', description: '7-day reading streak', earned: streak >= 7, color: 'red' },
    { key: 'collector', title: 'Collector', icon: '⭐', description: 'Mark 5 favorites', earned: favorites >= 5, color: 'yellow' }
  ]

  const earnedCount = achievements.filter(a => a.earned).length

  if (loading) return <main className="py-10"><div className="skeleton h-8 w-48 rounded mb-6" /><div className="skeleton h-96 rounded-xl" /></main>
  if (!user) return <main className="py-10"><p>Please <Link href="/login" className="text-inkPink">log in</Link> to manage your content.</p></main>

  return (
    <main className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Your Dashboard</h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
            <button onClick={() => setActiveTab('art')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'art' ? 'border-inkLime text-inkLime' : 'border-transparent text-neutral-500'}`}>
              Upload Art
            </button>
            <button onClick={() => setActiveTab('book')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'book' ? 'border-inkPurple text-inkPurple' : 'border-transparent text-neutral-500'}`}>
              Add Book
            </button>
            <button onClick={() => setActiveTab('review')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'review' ? 'border-inkPink text-inkPink' : 'border-transparent text-neutral-500'}`}>
              Write Review
            </button>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            {activeTab === 'art' && <ArtUpload />}
            {activeTab === 'book' && <BookForm />}
            {activeTab === 'review' && <ReviewEditor />}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <p className="text-sm text-neutral-500">Books Read</p>
              <p className="text-3xl font-bold text-inkPurple">{booksRead}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <p className="text-sm text-neutral-500">Currently Reading</p>
              <p className="text-3xl font-bold text-inkCyan">{booksReading}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <p className="text-sm text-neutral-500">Reviews</p>
              <p className="text-3xl font-bold text-inkPink">{reviews.length}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <p className="text-sm text-neutral-500">Artworks</p>
              <p className="text-3xl font-bold text-inkLime">{artworks.length}</p>
            </div>
          </div>

          <ReadingGoal />

          <BookRecommendations />

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <h4 className="font-medium mb-3">Reading Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">🔥 Current Streak</span>
                <span className="font-semibold text-orange-500">{streak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">📄 Total Pages</span>
                <span className="font-semibold">{totalPages.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">⭐ Favorites</span>
                <span className="font-semibold text-yellow-500">{favorites}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">🏷️ Top Genre</span>
                <span className="font-semibold text-inkPurple">{topGenre}</span>
              </div>
            </div>
          </div>

          {Object.keys(genreStats).length > 0 && (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <h4 className="font-medium mb-3">Genre Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(genreStats).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([genre, count]) => (
                  <div key={genre}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{genre}</span>
                      <span className="text-neutral-500">{count}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-inkPurple rounded-full" style={{ width: `${(count / books.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Achievements</h4>
              <span className="text-sm text-neutral-500">{earnedCount}/{achievements.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {achievements.filter(a => a.earned).map(a => (
                <span key={a.key} className="inline-flex items-center gap-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 text-xs font-medium" title={a.description}>
                  <span>{a.icon}</span>
                  <span>{a.title}</span>
                </span>
              ))}
              {earnedCount === 0 && <p className="text-sm text-neutral-500">Start adding books or art to earn badges!</p>}
            </div>
            {earnedCount > 0 && earnedCount < achievements.length && (
              <details className="mt-3">
                <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">View locked achievements</summary>
                <div className="mt-2 flex flex-wrap gap-2">
                  {achievements.filter(a => !a.earned).map(a => (
                    <span key={a.key} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-400" title={a.description}>
                      <span className="grayscale">{a.icon}</span>
                      <span>{a.title}</span>
                    </span>
                  ))}
                </div>
              </details>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <h4 className="font-medium mb-3">Recent Activity</h4>
            <ul className="space-y-2">
              {[...artworks.slice(0, 3).map(a => ({ type: 'art', title: a.title || 'Untitled', date: a.createdAt, id: a._id })),
                ...reviews.slice(0, 3).map(r => ({ type: 'review', title: r.bookTitle, date: r.createdAt, id: r._id })),
                ...books.slice(0, 3).map(b => ({ type: 'book', title: b.title, date: b.createdAt, id: b._id }))]
                .sort((a, b) => b.date - a.date)
                .slice(0, 5)
                .map(item => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link href={`/${item.type === 'art' ? 'artwork' : item.type}/${item.id}`} className="flex items-center gap-2 text-sm hover:text-inkPink transition-colors">
                      <span>{item.type === 'art' ? '🎨' : item.type === 'review' ? '✍️' : '📚'}</span>
                      <span className="truncate flex-1">{item.title}</span>
                      <span className="text-xs text-neutral-400">{new Date(item.date).toLocaleDateString()}</span>
                    </Link>
                  </li>
                ))}
              {artworks.length === 0 && reviews.length === 0 && books.length === 0 && (
                <li className="text-sm text-neutral-500">No activity yet</li>
              )}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}
