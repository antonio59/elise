'use client'
import { useState, useEffect, useRef } from 'react'
import { searchGoogleBooks, GoogleBook } from '@/lib/googleBooks'

type BookSearchProps = {
  onSelect: (book: GoogleBook) => void
  placeholder?: string
}

export default function BookSearch({ onSelect, placeholder = 'Search for a book...' }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GoogleBook[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const books = await searchGoogleBooks(query)
      setResults(books)
      setLoading(false)
      setShowResults(true)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleSelect = (book: GoogleBook) => {
    onSelect(book)
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? '⏳' : '🔍'}
        </span>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-80 overflow-y-auto z-50">
          {results.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => handleSelect(book)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
            >
              {book.coverUrl ? (
                <img src={book.coverUrl} alt="" className="w-10 h-14 object-cover rounded" />
              ) : (
                <div className="w-10 h-14 bg-purple-100 rounded flex items-center justify-center text-sm">📚</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{book.title}</p>
                <p className="text-sm text-gray-500 truncate">{book.authors.join(', ')}</p>
                {book.publishedDate && (
                  <p className="text-xs text-gray-400">{book.publishedDate.split('-')[0]}</p>
                )}
              </div>
              {book.pageCount && (
                <span className="text-xs text-gray-400">{book.pageCount}p</span>
              )}
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center text-gray-500 z-50">
          No books found. Try a different search.
        </div>
      )}
    </div>
  )
}
