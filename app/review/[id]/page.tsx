'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '../../../convex/_generated/dataModel'
import LikeButton from '@/components/LikeButton'

export default function ReviewDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [moodColor, setMoodColor] = useState('inkPink')
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const review = useQuery(api.reviews.getById, { reviewId: id as Id<"reviews"> })
  const updateReview = useMutation(api.reviews.update)
  const deleteReview = useMutation(api.reviews.remove)

  const isOwner = user && review && user._id === review.userId
  const moodColors: Record<string, string> = { inkPink: 'bg-inkPink', inkLime: 'bg-inkLime', inkCyan: 'bg-inkCyan', inkPurple: 'bg-inkPurple', inkYellow: 'bg-inkYellow' }

  const handleEdit = () => {
    if (review) { setContent(review.content); setRating(review.rating); setMoodColor(review.moodColor); setPublished(review.published) }
    setEditing(true)
  }

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    await updateReview({ token, reviewId: id as Id<"reviews">, content, rating, moodColor, published })
    setEditing(false); setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this review?') || !token) return
    setDeleting(true)
    await deleteReview({ token, reviewId: id as Id<"reviews"> })
    router.push('/gallery')
  }

  if (review === undefined) return <main className="py-10"><div className="skeleton h-8 w-48 rounded mb-4" /><div className="skeleton h-64 max-w-2xl mx-auto rounded-lg" /></main>
  if (!review) return <main className="py-10"><p>Not found. <Link href="/gallery" className="text-inkPink">Back</Link></p></main>

  return (
    <main className="py-10">
      <Link href="/gallery" className="text-sm text-neutral-500 hover:text-inkPink mb-4 inline-block">&larr; Back</Link>
      <div className="max-w-3xl mx-auto mt-4">
        <div className={`h-2 rounded-t-xl ${moodColors[review.moodColor] || 'bg-inkPink'}`} />
        <div className="rounded-b-xl border border-t-0 border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div><h1 className="text-2xl font-bold">{review.bookTitle}</h1><p className="text-neutral-600 dark:text-neutral-400">by {review.author}</p></div>
            <div className="flex text-yellow-400 text-xl">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
          </div>
          {editing ? (
            <div className="space-y-4">
              <div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => (<button key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-neutral-300'}`}>★</button>))}</div>
              <div><span className="text-sm">Mood Color</span><div className="flex gap-2 mt-1">{Object.keys(moodColors).map(color => (<button key={color} onClick={() => setMoodColor(color)} className={`w-8 h-8 rounded-full ${moodColors[color]} ${moodColor === color ? 'ring-2 ring-offset-2 ring-neutral-400' : ''}`} />))}</div></div>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm">Public</span></label>
              <div className="flex gap-2"><button onClick={handleSave} disabled={saving} className="rounded-md bg-inkPink text-white px-4 py-2 text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button><button onClick={() => setEditing(false)} className="rounded-md bg-neutral-200 dark:bg-neutral-700 px-4 py-2 text-sm">Cancel</button></div>
            </div>
          ) : (
            <>
              <div className="prose dark:prose-invert max-w-none"><p className="whitespace-pre-wrap">{review.content}</p></div>
              {review.imageUrl && <div className="mt-6"><img src={review.imageUrl} alt="" className="rounded-lg max-h-96 object-contain" /></div>}
            </>
          )}
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {review.user && <Link href={`/user/${review.userId}`} className="flex items-center gap-2 hover:opacity-80">{review.user.avatarUrl ? <img src={review.user.avatarUrl} alt="" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">👤</div>}<div><p className="font-medium">{review.user.username || 'Anonymous'}</p><p className="text-sm text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</p></div></Link>}
            <div className="flex items-center gap-2">
              <LikeButton contentId={review._id} contentType="review" />
              {isOwner && !editing && <><button onClick={handleEdit} className="rounded-md bg-inkCyan text-white px-4 py-2 text-sm">Edit</button><button onClick={handleDelete} disabled={deleting} className="rounded-md bg-red-500 text-white px-4 py-2 text-sm disabled:opacity-50">{deleting ? '...' : 'Delete'}</button></>}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
