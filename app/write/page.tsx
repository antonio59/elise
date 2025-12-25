'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { MOOD_COLORS, RatingType } from '@/lib/types'
import RatingPicker from '@/components/RatingPicker'
import RichTextEditor from '@/components/RichTextEditor'

export default function WriteReviewPage() {
  const router = useRouter()
  const { token, loading: isLoading } = useAuth()
  
  const [selectedBookId, setSelectedBookId] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(0)
  const [ratingType, setRatingType] = useState<RatingType>('stars')
  const [mood, setMood] = useState('sakura')
  const [richContent, setRichContent] = useState('')
  const [gifs, setGifs] = useState<Array<{ id: string; url: string; width: number; height: number }>>([])
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const books = useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? []
  const preferences = useQuery(api.preferences.get, token ? { token } : "skip")
  const createReview = useMutation(api.reviews.create)
  const setPreferredRatingType = useMutation(api.preferences.setRatingType)

  const readBooks = books.filter((b: any) => b.status === 'read' || b.status === 'reading')

  useEffect(() => {
    if (preferences?.preferredRatingType) {
      setRatingType(preferences.preferredRatingType as RatingType)
    }
  }, [preferences])

  const handleBookSelect = (id: string) => {
    setSelectedBookId(id)
    if (id === 'manual') {
      setBookTitle('')
      setAuthor('')
      return
    }
    const book = books.find((b: any) => b._id === id)
    if (book) {
      setBookTitle(book.title)
      setAuthor(book.author)
    }
  }

  const handleRatingTypeChange = async (type: RatingType) => {
    setRatingType(type)
    if (token) {
      await setPreferredRatingType({ token, ratingType: type })
    }
  }

  const handleGifAdd = (gif: { id: string; url: string; width: number; height: number }) => {
    setGifs([...gifs, gif])
    setRichContent(richContent + `<img src="${gif.url}" alt="GIF" class="inline-gif" />`)
  }

  const handlePublish = async () => {
    if (!token) return
    if (!bookTitle || !author) {
      setMessage('Please provide book title and author')
      return
    }

    setSaving(true)
    try {
      await createReview({
        token,
        bookTitle,
        author,
        rating,
        ratingType,
        moodColor: mood,
        content: richContent.replace(/<[^>]*>/g, '').slice(0, 500),
        richContent,
        gifs: gifs.length > 0 ? gifs : undefined,
        published,
      })
      setMessage('Published!')
      setTimeout(() => router.push('/explore'), 1000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to publish')
    }
    setSaving(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Loading...</div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Please log in to write a review</p>
          <button
            onClick={() => router.push('/login')}
          className="px-4 py-2 bg-sakura-500 text-white rounded-lg"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

const moodColorClasses: Record<string, string> = {
  sakura: 'bg-sakura-500',
  mint: 'bg-mint-500', 
  sky: 'bg-sky-500',
  kawaii: 'bg-kawaii-500',
  gold: 'bg-gold-500'
}

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            ← Back
          </button>
          <h1 className="font-semibold">Write Review</h1>
          <button
            onClick={handlePublish}
            disabled={saving}
          className="px-4 py-1.5 bg-sakura-500 text-white rounded-full text-sm font-medium hover:bg-sakura-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Book Selection */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">What book are you reviewing?</h2>
          
          {readBooks.length > 0 && (
            <div className="mb-4">
              <select
                value={selectedBookId}
                onChange={(e) => handleBookSelect(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                <option value="">Select from your bookshelf...</option>
                {readBooks.map((b: any) => (
                  <option key={b._id} value={b._id}>{b.title} by {b.author}</option>
                ))}
                <option value="manual">Enter manually...</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Book Title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              disabled={selectedBookId !== '' && selectedBookId !== 'manual'}
              className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 disabled:opacity-50"
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={selectedBookId !== '' && selectedBookId !== 'manual'}
              className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Rating & Mood */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Your Rating</h3>
              <RatingPicker
                value={rating}
                onChange={setRating}
                ratingType={ratingType}
                onTypeChange={handleRatingTypeChange}
                showTypeSelector
                size="lg"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Mood Color</h3>
              <div className="flex gap-3">
                {Object.keys(moodColorClasses).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setMood(color)}
                    className={`w-10 h-10 rounded-full ${moodColorClasses[color]} ${
                      mood === color ? 'ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-neutral-900 scale-110' : ''
                    } transition-all hover:scale-105`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rich Editor */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-4">Your Review</h3>
          <RichTextEditor
            content={richContent}
            onChange={setRichContent}
            placeholder="Share your thoughts about this book... What did you love? Who should read it? Add emojis, stickers, and GIFs to make it fun! ✨📚"
            customStickers={preferences?.customStickers || []}
            onGifAdd={handleGifAdd}
            minHeight="400px"
          />
        </div>

        {/* Publish Options */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 rounded-md accent-sakura-500"
            />
            <div>
              <span className="font-medium">Publish publicly</span>
              <p className="text-sm text-neutral-500">Others can see and like your review</p>
            </div>
          </label>
        </div>

        {message && (
          <div className="mt-4 text-center">
            <p className={`text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
