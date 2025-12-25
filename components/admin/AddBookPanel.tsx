'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/lib/convex'
import ImageUpload from '@/components/ImageUpload'
import BookSearch from '@/components/BookSearch'
import EmojiPicker from '@/components/EmojiPicker'
import GiphyPicker from '@/components/GiphyPicker'
import StickerLibraryPicker from '@/components/StickerLibraryPicker'
import { GoogleBook } from '@/lib/googleBooks'
import { GENRES } from '@/lib/types'
import { Id } from '@/convex/_generated/dataModel'

type Props = {
  token: string | null
  onComplete?: () => void
}

export default function AddBookPanel({ token, onComplete }: Props) {
  const createBook = useMutation(api.books.create)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [coverStorageId, setCoverStorageId] = useState<Id<'_storage'> | null>(null)
  const [genre, setGenre] = useState('')
  const [series, setSeries] = useState('')
  const [status, setStatus] = useState<'wishlist' | 'reading' | 'read'>('read')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [reviewGifs, setReviewGifs] = useState<Array<{ id: string; url: string }>>([])
  const [reviewStickers, setReviewStickers] = useState<Array<{ name: string; url: string }>>([])
  const [pages, setPages] = useState('')
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSelect = (book: GoogleBook) => {
    setTitle(book.title)
    setAuthor(book.authors.join(', '))
    setCoverUrl(book.coverUrlLarge || book.coverUrl || null)
    setGenre(book.categories?.[0] || '')
    setPages(book.pageCount?.toString() || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !title || !author) return
    setSaving(true)
    try {
      const reviewWithMedia =
        review +
        reviewStickers.map((s) => ` [sticker:${s.url}]`).join('') +
        reviewGifs.map((g) => ` [gif:${g.url}]`).join('')

      await createBook({
        token,
        title,
        author,
        coverUrl: coverUrl || undefined,
        coverStorageId: coverStorageId || undefined,
        genre: genre || undefined,
        series: series || undefined,
        status,
        rating,
        review: reviewWithMedia || undefined,
        published,
        pagesTotal: pages ? parseInt(pages) : undefined,
      })

      setTitle('')
      setAuthor('')
      setCoverUrl(null)
      setCoverStorageId(null)
      setGenre('')
      setSeries('')
      setStatus('read')
      setRating(5)
      setReview('')
      setReviewGifs([])
      setReviewStickers([])
      setPages('')
      setPublished(true)
      setMessage('Book added!')
      onComplete?.()
    } catch (err: any) {
      setMessage(err.message || 'Failed to add book')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add a New Book</h2>

      <div className="mb-6 p-4 bg-purple-50 rounded-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Search Google Books</label>
        <BookSearch onSelect={handleSelect} placeholder="Search by title, author, or ISBN..." />
        <p className="text-xs text-gray-500 mt-2">Search to auto-fill book details and cover</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {coverUrl && !coverStorageId ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover (from Google)</label>
            <div className="flex items-start gap-4">
              <img src={coverUrl} alt="Cover" className="w-24 h-36 object-cover rounded-lg shadow" />
              <div className="text-sm text-gray-500">
                <p>Cover loaded from Google Books</p>
                <button type="button" onClick={() => setCoverUrl(null)} className="text-red-500 hover:underline mt-1">Remove</button>
              </div>
            </div>
          </div>
        ) : (
          <ImageUpload
            token={token || ''}
            label="Upload Custom Cover"
            aspectRatio="portrait"
            currentImageUrl={null}
            onUploadComplete={(storageId, url) => {
              setCoverStorageId(storageId)
              setCoverUrl(url)
            }}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Magic Forest"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Elena Myst"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 320"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
            <input
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="e.g., One Piece"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              id="book-published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="book-published" className="text-sm">Share publicly</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="read">Read</option>
            <option value="reading">Currently Reading</option>
            <option value="wishlist">Want to Read</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">My Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you think of this book? ✨📚"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center gap-1 mt-2">
            <EmojiPicker onSelect={(emoji) => setReview((prev) => prev + emoji)} />
            <GiphyPicker onSelect={(gif) => setReviewGifs((prev) => [...prev, gif])} />
            <StickerLibraryPicker onSelect={(sticker) => setReviewStickers((prev) => [...prev, sticker])} />
          </div>
          {(reviewGifs.length > 0 || reviewStickers.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {reviewGifs.map((gif, i) => (
                <div key={i} className="relative">
                  <img src={gif.url} alt="" className="h-16 rounded" />
                  <button
                    type="button"
                    onClick={() => setReviewGifs((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              {reviewStickers.map((s, i) => (
                <div key={i} className="relative">
                  <img src={s.url} alt={s.name} className="h-12 w-12 object-contain" />
                  <button
                    type="button"
                    onClick={() => setReviewStickers((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving || !title || !author} className="w-full btn-primary disabled:opacity-50">
          {saving ? 'Adding...' : 'Add Book'}
        </button>
        {message && <p className="text-sm text-center text-neutral-600" role="status">{message}</p>}
      </form>
    </div>
  )
}
