'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '../../../convex/_generated/dataModel'
import LikeButton from '@/components/LikeButton'
import ShareButton from '@/components/ShareButton'

export default function ArtworkDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [style, setStyle] = useState('')
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const artwork = useQuery(api.artworks.getById, { artworkId: id as Id<"artworks"> })
  const updateArtwork = useMutation(api.artworks.update)
  const deleteArtwork = useMutation(api.artworks.remove)
  const addCustomSticker = useMutation(api.preferences.addCustomSticker)
  const [stickerAdded, setStickerAdded] = useState(false)

  const isOwner = user && artwork && user._id === artwork.userId

  const handleAddSticker = async () => {
    if (!token || !artwork) return
    await addCustomSticker({
      token,
      name: artwork.title || 'My Art',
      imageUrl: artwork.imageUrl,
      artworkId: artwork._id,
    })
    setStickerAdded(true)
    setTimeout(() => setStickerAdded(false), 2000)
  }

  const handleEdit = () => {
    if (artwork) { setTitle(artwork.title || ''); setStyle(artwork.style || ''); setPublished(artwork.published) }
    setEditing(true)
  }

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    await updateArtwork({ token, artworkId: id as Id<"artworks">, title, style, published })
    setEditing(false); setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this artwork?') || !token) return
    setDeleting(true)
    await deleteArtwork({ token, artworkId: id as Id<"artworks"> })
    router.push('/gallery')
  }

  if (artwork === undefined) return <main className="py-10"><div className="skeleton h-8 w-48 rounded mb-4" /><div className="skeleton aspect-square max-w-2xl mx-auto rounded-lg" /></main>
  if (!artwork) return <main className="py-10"><p>Not found. <Link href="/gallery" className="text-inkPink">Back</Link></p></main>

  return (
    <main className="py-10">
      <Link href="/gallery" className="text-sm text-neutral-500 hover:text-inkPink mb-4 inline-block">&larr; Back</Link>
      <div className="max-w-4xl mx-auto mt-4">
        <div className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg"><img src={artwork.imageUrl} alt={artwork.title || 'Artwork'} className="w-full" /></div>
        <div className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
                <input type="text" value={style} onChange={e => setStyle(e.target.value)} placeholder="Style" className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2" />
                <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm">Public</span></label>
                <div className="flex gap-2"><button onClick={handleSave} disabled={saving} className="rounded-md bg-inkLime text-inkBlack px-4 py-2 text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button><button onClick={() => setEditing(false)} className="rounded-md bg-neutral-200 dark:bg-neutral-700 px-4 py-2 text-sm">Cancel</button></div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{artwork.title || 'Untitled'}</h1>
                {artwork.style && <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-inkPurple/10 text-inkPurple">{artwork.style}</span>}
                {artwork.user && <Link href={`/user/${artwork.userId}`} className="flex items-center gap-2 mt-4 hover:opacity-80">{artwork.user.avatarUrl ? <img src={artwork.user.avatarUrl} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">👤</div>}<span className="font-medium">{artwork.user.username || 'Anonymous'}</span></Link>}
                <p className="text-sm text-neutral-500 mt-2">{new Date(artwork.createdAt).toLocaleDateString()}</p>
                {!artwork.published && <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Private</span>}
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <LikeButton contentId={artwork._id} contentType="artwork" />
            <ShareButton title={artwork.title || 'Artwork'} />
            {isOwner && (
              <button
                onClick={handleAddSticker}
                disabled={stickerAdded}
                className="rounded-md bg-inkYellow text-inkBlack px-4 py-2 text-sm font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {stickerAdded ? '✓ Added!' : '🎨 Make Sticker'}
              </button>
            )}
            {isOwner && !editing && <div className="flex gap-2 mt-2"><button onClick={handleEdit} className="rounded-md bg-inkCyan text-white px-4 py-2 text-sm">Edit</button><button onClick={handleDelete} disabled={deleting} className="rounded-md bg-red-500 text-white px-4 py-2 text-sm disabled:opacity-50">{deleting ? '...' : 'Delete'}</button></div>}
          </div>
        </div>
      </div>
    </main>
  )
}
