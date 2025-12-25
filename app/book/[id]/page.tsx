'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '@/convex/_generated/dataModel'
import EngagementButtons from '@/components/EngagementButtons'
import GiphyPicker from '@/components/GiphyPicker'
import EmojiPicker from '@/components/EmojiPicker'

function StarRating({ rating, max = 5, interactive = false, onChange }: { 
  rating: number; 
  max?: number; 
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  return (
    <div className="flex gap-0.5 text-xl">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i + 1)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function BookDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewContent, setReviewContent] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [selectedGifs, setSelectedGifs] = useState<Array<{ id: string; url: string; width: number; height: number }>>([])
  const [saving, setSaving] = useState(false)
  const [progressSaving, setProgressSaving] = useState(false)
  const [progressValue, setProgressValue] = useState<number>(0)

  const book = useQuery(api.books.getById, { bookId: id as Id<"books">, token: token ?? undefined })
  const reviews = useQuery(api.reviews.getByBookTitle, book ? { bookTitle: book.title } : "skip") ?? []
  const createReview = useMutation(api.reviews.create)
  const updateBook = useMutation(api.books.update)

  useEffect(() => {
    if (book?.pagesRead !== undefined) {
      setProgressValue(book.pagesRead)
    }
  }, [book?.pagesRead])

  const bookReviews = book ? reviews.filter(r => r.bookTitle === book.title) : []

  const handleEmojiSelect = (emoji: string) => {
    setReviewContent(prev => prev + emoji)
  }

  const handleGifSelect = (gif: { id: string; url: string; width: number; height: number }) => {
    setSelectedGifs(prev => [...prev, gif])
  }

  const removeGif = (id: string) => {
    setSelectedGifs(prev => prev.filter(g => g.id !== id))
  }

  const handleProgressSave = async (value: number) => {
    if (!token || !book) return
    setProgressSaving(true)
    try {
      await updateBook({ token, bookId: book._id, pagesRead: value })
    } finally {
      setProgressSaving(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !reviewContent || !book) return

    setSaving(true)
    try {
      await createReview({
        token,
        bookTitle: book.title,
        author: book.author,
        content: reviewContent,
        rating: reviewRating,
        moodColor: 'kawaii',
        published: true,
        gifs: selectedGifs.length > 0 ? selectedGifs : undefined,
      })
      setReviewContent('')
      setReviewRating(5)
      setSelectedGifs([])
      setShowReviewForm(false)
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  if (book === undefined) {
    return (
      <main className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-32 mb-6" />
          <div className="flex flex-col md:flex-row gap-8">
            <div className="skeleton w-64 h-96 rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="skeleton h-10 w-3/4" />
              <div className="skeleton h-6 w-1/2" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!book) {
    return (
      <main className="py-10 px-4 text-center">
        <p className="text-gray-500">Book not found.</p>
        <Link href="/" className="text-purple-600 hover:underline mt-4 inline-block">Go back home</Link>
      </main>
    )
  }

  return (
    <main className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 mb-6 inline-block">
          ← Back to Bookshelf
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-2xl shadow-lg" />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{book.author}</p>

            {book.genre && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                {book.genre}
              </span>
            )}

            <div className="mt-4 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                book.status === 'read' ? 'bg-green-100 text-green-700' :
                book.status === 'reading' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {book.status === 'read' ? '✓ Read' : book.status === 'reading' ? '📖 Reading' : '📋 Want to Read'}
              </span>
              {book.pagesTotal && (
                <span className="text-sm text-gray-500">{book.pagesTotal} pages</span>
              )}
            </div>

            {book.pagesTotal && (
              <div className="mt-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Reading progress</p>
                  <span className="text-sm text-gray-500">{progressValue}/{book.pagesTotal} pages</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={book.pagesTotal}
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{Math.round((progressValue / book.pagesTotal) * 100)}% complete</span>
                  <button
                    type="button"
                    disabled={!token || progressSaving}
                    onClick={() => handleProgressSave(progressValue)}
                    className="text-pink-600 font-medium disabled:opacity-50"
                  >
                    {progressSaving ? 'Saving...' : 'Save progress'}
                  </button>
                </div>
              </div>
            )}

            {/* Rating Display */}
            {book.rating && (
              <div className="mt-4">
                <StarRating rating={book.rating} />
              </div>
            )}

            {/* My Review from book */}
            {book.review && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 italic">“{book.review}”</p>
              </div>
            )}

            {/* Engagement Buttons */}
            <div className="mt-6">
              <EngagementButtons contentId={book._id} contentType="book" />
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                {!showReviewForm && token && (
                  <button onClick={() => setShowReviewForm(true)} className="btn-secondary text-sm">
                    Write Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <StarRating rating={reviewRating} interactive onChange={setReviewRating} />
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="What did you think of this book? 📚✨"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                    />
                    
                    {/* Emoji and GIF toolbar */}
                    <div className="flex items-center gap-2 mt-2 border-t border-gray-200 pt-2">
                      <EmojiPicker onSelect={handleEmojiSelect} />
                      <GiphyPicker onSelect={handleGifSelect} />
                    </div>
                  </div>

                  {/* Selected GIFs preview */}
                  {selectedGifs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedGifs.map((gif) => (
                        <div key={gif.id} className="relative">
                          <img src={gif.url} alt="GIF" className="h-20 rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeGif(gif.id)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button type="submit" disabled={saving || !reviewContent} className="btn-primary text-sm">
                      {saving ? 'Posting...' : 'Post Review'}
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {bookReviews.length > 0 ? (
                <div className="space-y-4">
                  {bookReviews.map((review) => (
                    <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-4">
                      <StarRating rating={review.rating || 0} />
                      <p className="mt-3 text-gray-700">“{review.content}”</p>
                      {review.gifs && review.gifs.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {review.gifs.map((gif) => (
                            <img key={gif.id} src={gif.url} alt="GIF" className="h-24 rounded-lg" />
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-3">
                        <EngagementButtons contentId={review._id} contentType="review" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !showReviewForm && (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
