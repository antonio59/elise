'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import MetricCard from '@/components/MetricCard'
import AddBookPanel from '@/components/admin/AddBookPanel'
import AddArtPanel from '@/components/admin/AddArtPanel'
import ImageUpload from '@/components/ImageUpload'
import { Id } from '@/convex/_generated/dataModel'

type Tab = 'overview' | 'add-book' | 'add-art' | 'stickers' | 'settings' | 'manage'

export default function AdminPage() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  
  const books = useQuery(api.books.getAllBooks, token ? { token } : "skip") ?? []
  const artworks = useQuery(api.artworks.getAllArtworks, token ? { token } : "skip") ?? []
  const reviews = useQuery(api.reviews.getAllReviews, token ? { token } : "skip") ?? []
  const siteSettings = useQuery(api.siteSettings.get)
  const engagementStats = useQuery(api.likes.getAllStats)
  const stickers = useQuery(api.stickers.getAll) ?? []

  const updateSettings = useMutation(api.siteSettings.update)
  const updateHeroImage = useMutation(api.siteSettings.updateHeroImage)
  const createSticker = useMutation(api.stickers.create)
  const removeSticker = useMutation(api.stickers.remove)

  // Book form
  // Sticker form
  const [stickerName, setStickerName] = useState('')
  const [stickerCategory, setStickerCategory] = useState('')
  const [stickerStorageId, setStickerStorageId] = useState<Id<"_storage"> | null>(null)
  const [stickerPreview, setStickerPreview] = useState<string | null>(null)
  const [stickerSaving, setStickerSaving] = useState(false)

  // Settings form
  const [siteName, setSiteName] = useState('')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')

  useEffect(() => {
    if (siteSettings) {
      setSiteName(siteSettings.siteName || "Niece's World")
      setHeroTitle(siteSettings.heroTitle || 'My Reading')
      setHeroSubtitle(siteSettings.heroSubtitle || 'Adventures')
      setHeroDescription(siteSettings.heroDescription || '')
      setHeroImagePreview(siteSettings.heroImageUrl || null)
    }
  }, [siteSettings])

  const totalBooks = books.length
  const booksRead = books.filter(b => b.status === 'read').length
  const totalArtworks = artworks.length
  const totalPages = books.reduce((sum, b) => sum + (b.pagesTotal || 0), 0)

  const handleAddSticker = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !stickerName || !stickerStorageId) return
    setStickerSaving(true)
    try {
      await createSticker({ token, name: stickerName, storageId: stickerStorageId, category: stickerCategory || undefined })
      setStickerName(''); setStickerCategory(''); setStickerStorageId(null); setStickerPreview(null)
    } catch (err) { console.error(err) }
    setStickerSaving(false)
  }

  const handleDeleteSticker = async (stickerId: Id<"stickers">) => {
    if (!token || !confirm('Delete this sticker?')) return
    await removeSticker({ token, stickerId })
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSettingsSaving(true); setSettingsMessage('')
    try {
      await updateSettings({ token, siteName, heroTitle, heroSubtitle, heroDescription })
      setSettingsMessage('Settings saved!')
      setTimeout(() => setSettingsMessage(''), 3000)
    } catch (err) { console.error(err); setSettingsMessage('Failed to save') }
    setSettingsSaving(false)
  }

  const handleHeroImageUpload = async (storageId: Id<"_storage">, url: string) => {
    if (!token) return
    setHeroImagePreview(url)
    try { await updateHeroImage({ token, storageId }) } catch (err) { console.error(err) }
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'add-book', label: 'Add Book', icon: '📚' },
    { key: 'add-art', label: 'Add Art', icon: '🎨' },
    { key: 'stickers', label: 'Stickers', icon: '🏷️' },
    { key: 'settings', label: 'Profile', icon: '⚙️' },
    { key: 'manage', label: 'Manage', icon: '📝' },
  ]

  return (
    <main className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as Tab)} className={`nav-pill whitespace-nowrap ${activeTab === tab.key ? 'nav-pill-active bg-gray-800' : 'nav-pill-inactive'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Books Read" value={booksRead} subtitle={`of ${totalBooks} total`} icon="📚" variant="purple" />
              <MetricCard title="Total Pages" value={totalPages.toLocaleString()} subtitle="pages read" icon="📖" variant="mint" />
              <MetricCard title="Artworks" value={totalArtworks} subtitle="pieces created" icon="🎨" variant="gold" />
              <MetricCard title="Stickers" value={stickers.length} subtitle="custom stickers" icon="🏷️" variant="default" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Engagement</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100"><p className="text-sm text-blue-600 font-medium">Total Likes</p><p className="text-2xl font-bold text-blue-700 mt-1">👍 {engagementStats?.totalLikes ?? 0}</p></div>
                <div className="bg-red-50 rounded-2xl p-4 border border-red-100"><p className="text-sm text-red-600 font-medium">Total Loves</p><p className="text-2xl font-bold text-red-700 mt-1">❤️ {engagementStats?.totalLoves ?? 0}</p></div>
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100"><p className="text-sm text-green-600 font-medium">Total Shares</p><p className="text-2xl font-bold text-green-700 mt-1">📤 {engagementStats?.totalShares ?? 0}</p></div>
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100"><p className="text-sm text-purple-600 font-medium">Total Engagement</p><p className="text-2xl font-bold text-purple-700 mt-1">🔥 {engagementStats?.totalEngagement ?? 0}</p></div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Books</h2>
              {books.length === 0 ? <p className="text-gray-500">No books added yet.</p> : (
                <div className="grid gap-3">{books.slice(0, 5).map((book) => (
                  <div key={book._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    {book.coverUrl ? <img src={book.coverUrl} alt="" className="w-12 h-16 object-cover rounded" /> : <div className="w-12 h-16 bg-purple-100 rounded flex items-center justify-center">📚</div>}
                    <div className="flex-1 min-w-0"><p className="font-semibold text-gray-900 truncate">{book.title}</p><p className="text-sm text-gray-500">{book.author}</p>{book.rating && <div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={`text-sm ${i < book.rating! ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>)}</div>}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.status === 'read' ? 'bg-green-100 text-green-700' : book.status === 'reading' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{book.status === 'read' ? 'Read' : book.status === 'reading' ? 'Reading' : 'Want to Read'}</span>
                  </div>
                ))}</div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Artworks</h2>
              {artworks.length === 0 ? <p className="text-gray-500">No artworks added yet.</p> : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{artworks.slice(0, 4).map((art) => (
                  <div key={art._id}><div className="aspect-square rounded-xl overflow-hidden bg-gray-100"><img src={art.imageUrl} alt={art.title || ''} className="w-full h-full object-cover" /></div><p className="mt-2 text-sm font-medium text-gray-900 truncate">{art.title}</p></div>
                ))}</div>
              )}
            </div>
          </div>
        )}

        {/* Add Book */}
        {activeTab === 'add-book' && (
          <AddBookPanel token={token} onComplete={() => setActiveTab('overview')} />
        )}

        {/* Add Art */}
        {activeTab === 'add-art' && (
          <AddArtPanel token={token} onComplete={() => setActiveTab('overview')} />
        )}

        {/* Stickers */}
        {activeTab === 'stickers' && (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create Stickers</h2>
            <form onSubmit={handleAddSticker} className="space-y-5 mb-8">
              <ImageUpload token={token || ''} label="Sticker Image *" aspectRatio="square" currentImageUrl={stickerPreview} onUploadComplete={(storageId, url) => { setStickerStorageId(storageId); setStickerPreview(url) }} />
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Sticker Name *</label><input type="text" value={stickerName} onChange={(e) => setStickerName(e.target.value)} placeholder="e.g., Happy Star" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" value={stickerCategory} onChange={(e) => setStickerCategory(e.target.value)} placeholder="e.g., Emotions, Animals, Stars" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500" /></div>
              <button type="submit" disabled={stickerSaving || !stickerName || !stickerStorageId} className="w-full btn-primary disabled:opacity-50">{stickerSaving ? 'Creating...' : 'Create Sticker'}</button>
            </form>
            <h3 className="text-lg font-bold text-gray-900 mb-4">My Stickers ({stickers.length})</h3>
            {stickers.length === 0 ? <p className="text-gray-500">No custom stickers yet.</p> : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">{stickers.map((sticker) => (<div key={sticker._id} className="group relative"><div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200"><img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-cover" /></div><p className="text-xs text-center mt-1 truncate">{sticker.name}</p><button onClick={() => handleDeleteSticker(sticker._id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button></div>))}</div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Site Profile</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="p-6 bg-purple-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4">Hero Section</h3>
                <div className="mb-4"><ImageUpload token={token || ''} label="Hero Image" aspectRatio="portrait" currentImageUrl={heroImagePreview} onUploadComplete={handleHeroImageUpload} /><p className="text-xs text-gray-500 mt-2">This image appears on your homepage</p></div>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label><input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Niece's World" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Hero Title (Line 1)</label><input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="My Reading" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Hero Title (Line 2)</label><input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Adventures" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} placeholder="I'm collecting all the magical worlds..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                </div>
              </div>
              <button type="submit" disabled={settingsSaving} className="w-full btn-primary disabled:opacity-50">{settingsSaving ? 'Saving...' : 'Save Settings'}</button>
              {settingsMessage && <p className={`text-center text-sm ${settingsMessage.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>{settingsMessage}</p>}
            </form>
          </div>
        )}

        {/* Manage */}
        {activeTab === 'manage' && (
          <div className="space-y-8">
            <div><h2 className="text-xl font-bold text-gray-900 mb-4">All Books ({books.length})</h2>{books.length === 0 ? <p className="text-gray-500">No books to manage.</p> : (<div className="space-y-2">{books.map((book) => (<div key={book._id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">{book.coverUrl ? <img src={book.coverUrl} alt="" className="w-10 h-14 object-cover rounded" /> : <div className="w-10 h-14 bg-purple-100 rounded flex items-center justify-center text-sm">📚</div>}<div className="flex-1 min-w-0"><p className="font-medium text-gray-900 truncate">{book.title}</p><p className="text-sm text-gray-500">{book.author}</p></div>{book.rating && <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={`text-sm ${i < book.rating! ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>)}</div>}</div>))}</div>)}</div>
            <div><h2 className="text-xl font-bold text-gray-900 mb-4">All Artworks ({artworks.length})</h2>{artworks.length === 0 ? <p className="text-gray-500">No artworks to manage.</p> : (<div className="grid grid-cols-3 sm:grid-cols-6 gap-3">{artworks.map((art) => (<div key={art._id} className="aspect-square rounded-lg overflow-hidden bg-gray-100"><img src={art.imageUrl} alt={art.title || ''} className="w-full h-full object-cover" /></div>))}</div>)}</div>
          </div>
        )}
      </div>
    </main>
  )
}
