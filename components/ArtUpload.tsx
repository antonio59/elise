'use client'
import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { ART_STYLES } from '@/lib/types'

type FileWithPreview = { file: File; preview: string; title: string }

export default function ArtUpload() {
  const { token } = useAuth()
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [style, setStyle] = useState('')
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [published, setPublished] = useState(true)
  const [selectedSeries, setSelectedSeries] = useState('')
  const [newSeriesName, setNewSeriesName] = useState('')
  const [showNewSeries, setShowNewSeries] = useState(false)

  const series: any[] = useQuery(api.artworks.getMySeries, token ? { token } : "skip") ?? []
  const createArtwork = useMutation(api.artworks.create)
  const createSeriesMut = useMutation(api.artworks.createSeries)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    const validFiles: FileWithPreview[] = []
    for (const f of Array.from(e.target.files || [])) {
      if (!allowed.includes(f.type) || f.size > 10 * 1024 * 1024) continue
      validFiles.push({ file: f, preview: URL.createObjectURL(f), title: f.name.replace(/\.[^/.]+$/, '') })
    }
    if (validFiles.length > 0) { setFiles(prev => [...prev, ...validFiles]); setMessage('') }
  }

  const handleCreateSeries = async () => {
    if (!newSeriesName.trim() || !token) return
    const id = await createSeriesMut({ token, title: newSeriesName.trim() })
    setSelectedSeries(id); setNewSeriesName(''); setShowNewSeries(false)
  }

  const onUpload = async () => {
    if (files.length === 0 || !token) return
    setUploading(true); let successCount = 0
    for (let i = 0; i < files.length; i++) {
      try {
        const uploadUrl = await generateUploadUrl({ token })
        const result = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': files[i].file.type }, body: files[i].file })
        const { storageId } = await result.json()
        const imageUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.convex.cloud', '.convex.site')}/getImage?storageId=${storageId}`
        await createArtwork({ token, title: files[i].title || undefined, style: style || undefined, imageUrl, storageId, published, seriesId: selectedSeries ? selectedSeries as any : undefined, seriesOrder: selectedSeries ? i : undefined })
        successCount++
      } catch (e) { console.error(e) }
    }
    files.forEach(f => URL.revokeObjectURL(f.preview))
    setFiles([]); setStyle(''); setSelectedSeries(''); setMessage(`Uploaded ${successCount} of ${files.length} images`); setUploading(false)
  }

  const inputClass = "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 text-center hover:border-inkLime transition-colors">
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={onFiles} className="hidden" id="art-upload" />
        <label htmlFor="art-upload" className="cursor-pointer"><div className="text-4xl mb-2">🎨</div><p className="font-medium">Drop images here or click to browse</p><p className="text-sm text-neutral-500 mt-1">PNG, JPG, WebP, GIF up to 10MB each</p></label>
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((f, i) => (
            <div key={i} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800"><img src={f.preview} alt="" className="w-full h-full object-cover" /></div>
              <button onClick={() => { URL.revokeObjectURL(f.preview); setFiles(prev => prev.filter((_, j) => j !== i)) }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-sm opacity-0 group-hover:opacity-100">x</button>
              <input type="text" value={f.title} onChange={e => setFiles(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} placeholder="Title" className="mt-1 w-full text-xs rounded border border-neutral-200 dark:border-neutral-700 px-2 py-1" />
            </div>
          ))}
        </div>
      )}
      <input type="text" list="art-styles" placeholder="Style (e.g. Isekai, Fantasy)" value={style} onChange={e => setStyle(e.target.value)} className={inputClass} />
      <datalist id="art-styles">{ART_STYLES.map(s => <option key={s} value={s} />)}</datalist>
      <select value={selectedSeries} onChange={e => { if (e.target.value === 'new') { setShowNewSeries(true); setSelectedSeries('') } else setSelectedSeries(e.target.value) }} className={inputClass}>
        <option value="">No series</option>{series.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}<option value="new">+ Create new series</option>
      </select>
      {showNewSeries && (<div className="flex gap-2"><input type="text" placeholder="Series name" value={newSeriesName} onChange={e => setNewSeriesName(e.target.value)} className={`flex-1 ${inputClass}`} /><button onClick={handleCreateSeries} className="rounded-md bg-inkPurple text-white px-4 py-2">Create</button><button onClick={() => setShowNewSeries(false)} className="rounded-md bg-neutral-200 dark:bg-neutral-700 px-4 py-2">Cancel</button></div>)}
      <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm">Publish publicly</span></label>
      <button onClick={onUpload} disabled={files.length === 0 || uploading} className="w-full rounded-md bg-inkLime text-inkBlack px-4 py-2 font-medium hover:bg-lime-400 disabled:opacity-50">{uploading ? `Uploading...` : `Upload ${files.length} Art`}</button>
      {message && <p className="text-sm text-center">{message}</p>}
    </div>
  )
}
