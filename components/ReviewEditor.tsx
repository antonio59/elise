'use client'
import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { MOOD_COLORS } from '@/lib/types'

export default function ReviewEditor() {
  const { token } = useAuth()
  const [selectedBookId, setSelectedBookId] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [mood, setMood] = useState('inkPink')
  const [content, setContent] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [published, setPublished] = useState(true)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  const books: any[] = useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? []
  const createReview = useMutation(api.reviews.create)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const readingBooks = books.filter((b: any) => b.status === 'read' || b.status === 'reading')

  const handleBookSelect = (id: string) => {
    setSelectedBookId(id)
    if (id === 'manual') { setBookTitle(''); setAuthor(''); return }
    const book = books.find(b => b._id === id)
    if (book) { setBookTitle(book.title); setAuthor(book.author) }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return
    if (file.size > 5 * 1024 * 1024) { setMessage('Image must be under 5MB'); return }
    try {
      const uploadUrl = await generateUploadUrl({ token })
      const result = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
      const { storageId } = await result.json()
      const url = `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.convex.cloud', '.convex.site')}/getImage?storageId=${storageId}`
      setImagePreview(url)
    } catch { setMessage('Failed to upload image') }
  }

  const onPublish = async () => {
    if (!token || !bookTitle || !author) { setMessage('Please provide book title and author'); return }
    setUploading(true)
    try {
      await createReview({ token, bookTitle, author, rating, moodColor: mood, content, imageUrl: imagePreview || undefined, published })
      setMessage('Published!')
      setBookTitle(''); setAuthor(''); setRating(0); setMood('inkPink'); setContent(''); setSelectedBookId(''); setImagePreview(null)
    } catch (error: any) { setMessage(error.message || 'Failed to publish') }
    setUploading(false)
  }

  const inputClass = "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
  const moodColorClasses: Record<string, string> = { inkPink: 'bg-inkPink', inkLime: 'bg-inkLime', inkCyan: 'bg-inkCyan', inkPurple: 'bg-inkPurple', inkYellow: 'bg-inkYellow' }

  return (
    <div className="space-y-4">
      {readingBooks.length > 0 && (
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Select a book from your shelf</span>
          <select value={selectedBookId} onChange={e => handleBookSelect(e.target.value)} className={`mt-1 ${inputClass}`}>
            <option value="">-- Select a book --</option>
            {readingBooks.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
            <option value="manual">Or enter manually...</option>
          </select>
        </label>
      )}
      <input type="text" placeholder="Book Title" value={bookTitle} onChange={e => setBookTitle(e.target.value)} className={inputClass} disabled={selectedBookId !== '' && selectedBookId !== 'manual'} />
      <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className={inputClass} disabled={selectedBookId !== '' && selectedBookId !== 'manual'} />
      <div className="grid grid-cols-2 gap-4">
        <div><span className="text-sm">Rating</span><div className="flex gap-1 mt-1">{[1, 2, 3, 4, 5].map(star => (<button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`}>★</button>))}</div></div>
        <div><span className="text-sm">Mood Color</span><div className="flex gap-2 mt-1">{Object.keys(moodColorClasses).map(color => (<button key={color} type="button" onClick={() => setMood(color)} className={`w-8 h-8 rounded-full ${moodColorClasses[color]} ${mood === color ? 'ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-neutral-900' : ''} transition-all`} />))}</div></div>
      </div>
      <textarea placeholder="Write your review..." value={content} onChange={e => setContent(e.target.value)} className={`${inputClass} h-40 resize-none`} />
      <div>
        <span className="text-sm">Add illustration (optional)</span>
        {imagePreview ? (
          <div className="relative mt-2 inline-block"><img src={imagePreview} alt="" className="max-h-32 rounded-md" /><button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm">x</button></div>
        ) : (
          <div className="mt-2"><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="review-image" /><label htmlFor="review-image" className="inline-block px-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700">Upload image</label></div>
        )}
      </div>
      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm">Publish publicly</span></label>
      <button onClick={onPublish} disabled={uploading} className="w-full rounded-md bg-inkPink text-white px-4 py-2 hover:bg-pink-600 transition-colors disabled:opacity-50">{uploading ? 'Publishing...' : 'Publish Review'}</button>
      {message && <p className="text-sm text-center" role="status">{message}</p>}
    </div>
  )
}
