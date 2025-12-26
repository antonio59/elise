'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { GENRES } from '@/lib/types'
import { Doc } from '../convex/_generated/dataModel'

type SearchResult = {
  title: string
  author_name?: string[]
  cover_i?: number
  number_of_pages_median?: number
  subject?: string[]
}

type BookFormProps = {
  book?: Doc<"books">
  onSaved?: () => void
}

export default function BookForm({ book, onSaved }: BookFormProps) {
  const { token } = useAuth()
  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [coverUrl, setCoverUrl] = useState(book?.coverUrl || '')
  const [rating, setRating] = useState<number>(book?.rating || 0)
  const [status, setStatus] = useState<'reading' | 'read' | 'wishlist'>(book?.status || 'reading')
  const [genre, setGenre] = useState(book?.genre || '')
  const [series, setSeries] = useState(book?.series || '')
  const [pagesTotal, setPagesTotal] = useState<number>(book?.pagesTotal || 0)
  const [pagesRead, setPagesRead] = useState<number>(book?.pagesRead || 0)
  const [isFavorite, setIsFavorite] = useState(book?.isFavorite || false)
  const [published, setPublished] = useState(book?.published ?? true)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const createBook = useMutation(api.books.create)
  const updateBook = useMutation(api.books.update)
  const isEditing = !!book

  const searchBooks = async () => {
    if (!query) return
    setSearching(true)
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=title,author_name,cover_i,number_of_pages_median,subject`)
      const data = await res.json()
      setResults(data.docs || [])
    } catch (e) {
      console.error(e)
    } finally {
      setSearching(false)
    }
  }

  const selectBook = (searchBook: SearchResult) => {
    setTitle(searchBook.title)
    setAuthor(searchBook.author_name?.[0] || 'Unknown')
    if (searchBook.cover_i) setCoverUrl(`https://covers.openlibrary.org/b/id/${searchBook.cover_i}-L.jpg`)
    else setCoverUrl('')
    if (searchBook.number_of_pages_median) setPagesTotal(searchBook.number_of_pages_median)
    const matchedGenre = GENRES.find(g => searchBook.subject?.some(s => s.toLowerCase().includes(g.toLowerCase())))
    if (matchedGenre) setGenre(matchedGenre)
    setResults([])
    setQuery('')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) { setMessage('Log in to add books'); return }
    try {
      if (isEditing) {
        await updateBook({
          token,
          bookId: book._id,
          title,
          author,
          coverUrl: coverUrl || undefined,
          rating: status === 'read' ? rating : undefined,
          status,
          genre: genre || undefined,
          series: series || undefined,
          published,
          pagesTotal: pagesTotal || undefined,
          pagesRead: pagesRead || undefined,
          isFavorite,
        })
        setMessage('Updated!')
      } else {
        await createBook({
          token,
          title,
          author,
          coverUrl: coverUrl || undefined,
          rating: status === 'read' ? rating : undefined,
          status,
          genre: genre || undefined,
          series: series || undefined,
          published,
          pagesTotal: pagesTotal || undefined,
          pagesRead: pagesRead || undefined,
          isFavorite,
        })
        setMessage('Added!')
        setTitle(''); setAuthor(''); setCoverUrl(''); setRating(0); setStatus('reading'); setGenre(''); setSeries(''); setPagesTotal(0); setPagesRead(0); setIsFavorite(false); setPublished(true)
      }
      onSaved?.()
    } catch (error: any) { setMessage(error.message || 'Failed to save') }
  }

  const inputClass = "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"

  return (
    <div className="space-y-4">
      {!isEditing && (
        <div className="relative">
          <div className="flex gap-2">
            <input type="text" placeholder="Search for a book..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), searchBooks())} className={`${inputClass} text-sm`} />
            <button type="button" onClick={searchBooks} disabled={searching} className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-3 py-2 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700">{searching ? '...' : 'Search'}</button>
          </div>
          {results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg">
              {results.map((searchBook, i) => (
                <li key={i}><button type="button" onClick={() => selectBook(searchBook)} className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"><span className="font-medium">{searchBook.title}</span><span className="ml-2 text-neutral-500">{searchBook.author_name?.[0]}</span></button></li>
              ))}
            </ul>
          )}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-3 border-t border-neutral-100 dark:border-neutral-800 pt-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} required />
        <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className={inputClass} required />
        <input type="url" placeholder="Cover URL" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className={inputClass} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-sm">Status</span><select value={status} onChange={e => setStatus(e.target.value as any)} className={`mt-1 ${inputClass}`}><option value="reading">Currently Reading</option><option value="read">Read</option><option value="wishlist">Wishlist</option></select></label>
          <label className="block"><span className="text-sm">Genre</span><select value={genre} onChange={e => setGenre(e.target.value)} className={`mt-1 ${inputClass}`}><option value="">Select genre...</option>{GENRES.map(g => <option key={g} value={g}>{g}</option>)}</select></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-sm">Series</span><input type="text" placeholder="e.g., One Piece" value={series} onChange={e => setSeries(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
          <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 rounded" /><span>Share publicly</span></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-sm">Total Pages</span><input type="number" min={0} value={pagesTotal} onChange={e => setPagesTotal(Number(e.target.value))} className={`mt-1 ${inputClass}`} /></label>
          <label className="block"><span className="text-sm">Pages Read</span><input type="number" min={0} max={pagesTotal || undefined} value={pagesRead} onChange={e => setPagesRead(Number(e.target.value))} className={`mt-1 ${inputClass}`} /></label>
        </div>
        {status === 'read' && (<label className="block"><span className="text-sm">Rating</span><div className="flex gap-1 mt-1">{[1, 2, 3, 4, 5].map(star => (<button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`}>★</button>))}</div></label>)}
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFavorite} onChange={e => setIsFavorite(e.target.checked)} className="w-4 h-4 rounded" /><span className="text-sm">⭐ Mark as Favorite</span></label>
        <button type="submit" className="rounded-md bg-emerald-500 text-white px-4 py-2 w-full hover:bg-emerald-600 transition-colors">{isEditing ? 'Update Book' : 'Add Book'}</button>
        {message && <p className="text-sm text-center" role="status">{message}</p>}
      </form>
    </div>
  )
}
