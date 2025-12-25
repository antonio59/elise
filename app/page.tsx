'use client'
import { useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import { useRouter } from 'next/navigation'
import BookCard, { BookCardSkeleton } from '@/components/BookCard'

export default function HomePage() {
  const router = useRouter()
  const books = useQuery(api.books.getPublicBooks, { limit: 12 }) ?? []
  const reviews = useQuery(api.reviews.getPublished, { limit: 50 }) ?? []
  const siteSettings = useQuery(api.siteSettings.get)

  const booksWithReviews = books.slice(0, 6).map(book => {
    const bookReview = reviews.find(r => r.bookTitle === book.title)
    return {
      ...book,
      review: book.review || bookReview?.content,
      rating: book.rating || bookReview?.rating || 0
    }
  })

  const heroTitle = siteSettings?.heroTitle || 'My Reading'
  const heroSubtitle = siteSettings?.heroSubtitle || 'Adventures'
  const heroDescription = siteSettings?.heroDescription || "I'm collecting all the magical worlds I've visited and the stories that made me smile. Take a look around!"
  const heroImageUrl = siteSettings?.heroImageUrl

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">
                Welcome to my space! ✨
              </span>
              <h1 className="text-4xl lg:text-6xl font-black leading-tight">
                <span className="text-gray-900">{heroTitle}</span>
                <br />
                <span className="text-gradient-pink">{heroSubtitle}</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                {heroDescription}
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-80 h-96 lg:w-96 lg:h-[450px] bg-white rounded-3xl shadow-xl overflow-hidden">
                {heroImageUrl ? (
                  <img 
                    src={heroImageUrl} 
                    alt="Hero" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <div className="text-center p-8">
                      <div className="text-8xl mb-4">📖</div>
                      <p className="text-gray-400 text-sm">Add a hero image in Admin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Reads Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="section-header">
            <h2 className="section-title">Latest Reads</h2>
            <span className="section-badge">{books.length} books</span>
          </div>

          {books === undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">No books yet!</p>
              <p className="text-gray-400 mt-2">Add your first book in the Admin section</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {booksWithReviews.map((book) => (
                <BookCard
                  key={book._id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  rating={book.rating}
                  review={book.review}
                  progress={book.status === 'read' ? 100 : book.status === 'reading' ? 50 : 0}
                  onClick={() => router.push(`/book/${book._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
