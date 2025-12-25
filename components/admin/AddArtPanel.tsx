'use client'

import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/lib/convex'
import ImageUpload from '@/components/ImageUpload'
import EmojiPicker from '@/components/EmojiPicker'
import GiphyPicker from '@/components/GiphyPicker'
import StickerLibraryPicker from '@/components/StickerLibraryPicker'
import { Id } from '@/convex/_generated/dataModel'

type Props = {
  token: string | null
  onComplete?: () => void
}

export default function AddArtPanel({ token, onComplete }: Props) {
  const createArtwork = useMutation(api.artworks.createWithUpload)
  const [title, setTitle] = useState('')
  const [style, setStyle] = useState('')
  const [storageId, setStorageId] = useState<Id<'_storage'> | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dateDrawn, setDateDrawn] = useState('')
  const [thoughts, setThoughts] = useState('')
  const [thoughtGifs, setThoughtGifs] = useState<Array<{ id: string; url: string }>>([])
  const [thoughtStickers, setThoughtStickers] = useState<Array<{ name: string; url: string }>>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const mySeries = useQuery(api.artworks.getMySeries, token ? { token } : 'skip') ?? []
  const [seriesId, setSeriesId] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !title || !storageId) return
    setSaving(true)
    try {
      const thoughtsWithMedia =
        thoughts +
        thoughtStickers.map((s) => ` [sticker:${s.url}]`).join('') +
        thoughtGifs.map((g) => ` [gif:${g.url}]`).join('')

      await createArtwork({
        token,
        title,
        style: style || undefined,
        storageId,
        published: true,
        dateDrawn: dateDrawn || undefined,
        thoughts: thoughtsWithMedia || undefined,
        seriesId: seriesId ? (seriesId as any) : undefined,
      })

      setTitle('')
      setStyle('')
      setStorageId(null)
      setPreview(null)
      setDateDrawn('')
      setThoughts('')
      setThoughtGifs([])
      setThoughtStickers([])
      setSeriesId('')
      setMessage('Artwork added!')
      onComplete?.()
    } catch (err: any) {
      setMessage(err.message || 'Failed to add artwork')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Artwork</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <ImageUpload
          token={token || ''}
          label="Artwork Image *"
          aspectRatio="square"
          currentImageUrl={preview}
          onUploadComplete={(id, url) => {
            setStorageId(id)
            setPreview(url)
          }}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Cat Wizard"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style / Category</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., Digital Art"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Drawn</label>
            <input
              type="date"
              value={dateDrawn}
              onChange={(e) => setDateDrawn(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
        {mySeries && mySeries.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
            <select
              value={seriesId}
              onChange={(e) => setSeriesId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">No series</option>
              {mySeries.map((series: any) => (
                <option key={series._id} value={series._id as string}>
                  {series.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">My Thoughts</label>
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="What inspired this piece? 🎨✨"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <div className="flex items-center gap-1 mt-2">
            <EmojiPicker onSelect={(emoji) => setThoughts((prev) => prev + emoji)} />
            <GiphyPicker onSelect={(gif) => setThoughtGifs((prev) => [...prev, gif])} />
            <StickerLibraryPicker onSelect={(sticker) => setThoughtStickers((prev) => [...prev, sticker])} />
          </div>
          {(thoughtGifs.length > 0 || thoughtStickers.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {thoughtGifs.map((gif, i) => (
                <div key={i} className="relative">
                  <img src={gif.url} alt="" className="h-16 rounded" />
                  <button
                    type="button"
                    onClick={() => setThoughtGifs((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              {thoughtStickers.map((s, i) => (
                <div key={i} className="relative">
                  <img src={s.url} alt={s.name} className="h-12 w-12 object-contain" />
                  <button
                    type="button"
                    onClick={() => setThoughtStickers((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" disabled={saving || !title || !storageId} className="w-full btn-primary disabled:opacity-50">
          {saving ? 'Adding...' : 'Add Artwork'}
        </button>
        {message && <p className="text-sm text-center text-neutral-600" role="status">{message}</p>}
      </form>
    </div>
  )
}
