'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, token, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const stats: any = useQuery(api.users.getMyStats, token ? { token } : "skip")
  const books: any[] = useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? []
  const artworks: any[] = useQuery(api.artworks.getMyArtworks, token ? { token } : "skip") ?? []
  const updateProfile = useMutation(api.auth.updateProfile)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setBio(user.bio || '')
      setAvatarPreview(user.avatarUrl || null)
    }
  }, [user])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Avatar must be under 2MB')
      return
    }

    setAvatarPreview(URL.createObjectURL(file))

    try {
      const uploadUrl = await generateUploadUrl({ token })
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file
      })
      const { storageId } = await result.json()
      const url = `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.convex.cloud', '.convex.site')}/getImage?storageId=${storageId}`
      setAvatarPreview(url)
    } catch (error: any) {
      setMessage('Failed to upload avatar')
    }
  }

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setMessage('')
    try {
      await updateProfile({ token, username, bio, avatarUrl: avatarPreview || undefined })
      setMessage('Profile saved!')
    } catch (error: any) {
      setMessage(error.message || 'Failed to save')
    }
    setSaving(false)
  }

  if (loading) return <main className="py-10"><div className="skeleton h-8 w-32 rounded mb-4" /><div className="skeleton h-40 w-full rounded" /></main>
  if (!user) return <main className="py-10"><p>Please <Link href="/login" className="text-inkPink">log in</Link> to view your profile.</p></main>

  const recentBooks = books.slice(0, 4)
  const recentArt = artworks.slice(0, 4)

  return (
    <main className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Your Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-neutral-400">👤</div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-inkPink rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                <span className="text-white text-sm">📷</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <div className="flex-1 space-y-3">
              <label className="block">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Bio</span>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                />
              </label>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-emerald-500 text-white px-6 py-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {message && <p className="text-sm mt-2">{message}</p>}
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <h3 className="text-xl font-medium mb-4">Recent Books</h3>
            {recentBooks.length === 0 ? (
              <p className="text-neutral-500">No books yet. <Link href="/dashboard" className="text-inkCyan">Add some!</Link></p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentBooks.map(book => (
                  <Link key={book._id} href={`/book/${book._id}`} className="group">
                    <div className="aspect-[2/3] rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm group-hover:-translate-y-1 transition-transform">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">📚</div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium truncate">{book.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <h3 className="text-xl font-medium mb-4">Recent Artwork</h3>
            {recentArt.length === 0 ? (
              <p className="text-neutral-500">No artwork yet. <Link href="/dashboard" className="text-inkLime">Upload some!</Link></p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentArt.map(art => (
                  <Link key={art._id} href={`/artwork/${art._id}`} className="group">
                    <div className="aspect-square rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm group-hover:-translate-y-1 transition-transform">
                      <img src={art.imageUrl} alt={art.title || 'Artwork'} className="w-full h-full object-cover" />
                    </div>
                    <p className="mt-2 text-sm font-medium truncate">{art.title || 'Untitled'}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h3 className="font-medium">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-inkPurple">{stats?.books ?? 0}</p>
                <p className="text-sm text-neutral-500">Books</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-inkLime">{stats?.artworks ?? 0}</p>
                <p className="text-sm text-neutral-500">Artworks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-inkPink">{stats?.reviews ?? 0}</p>
                <p className="text-sm text-neutral-500">Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-inkCyan">{stats?.totalPages ?? 0}</p>
                <p className="text-sm text-neutral-500">Pages</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="font-medium mb-3">Account</h3>
            <p className="text-sm text-neutral-500">{user.email}</p>
            <p className="text-sm text-neutral-500 mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
