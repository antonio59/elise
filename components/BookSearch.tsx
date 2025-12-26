"use client";
import { useState, useEffect, useRef } from "react";
import { searchBooks, BookResult } from "@/lib/bookSearch";
import { Search, Loader2, Book } from "lucide-react";

type BookSearchProps = {
  onSelect: (book: BookResult) => void;
  placeholder?: string;
};

export default function BookSearch({
  onSelect,
  placeholder = "Search by title, author, or ISBN...",
}: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const books = await searchBooks(query);
      setResults(books);
      setLoading(false);
      setShowResults(true);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (book: BookResult) => {
    onSelect(book);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </span>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-800 max-h-80 overflow-y-auto z-50">
          {results.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => handleSelect(book)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left border-b border-gray-50 dark:border-neutral-800 last:border-0"
            >
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt=""
                  className="w-10 h-14 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-14 bg-gray-100 dark:bg-neutral-800 rounded flex items-center justify-center">
                  <Book size={16} className="text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {book.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {book.authors.join(", ")}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {book.publishedDate && (
                    <span className="text-xs text-gray-400">
                      {book.publishedDate.split("-")[0]}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      book.source === "google"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {book.source === "google" ? "Google" : "Open Library"}
                  </span>
                </div>
              </div>
              {book.pageCount && (
                <span className="text-xs text-gray-400">{book.pageCount}p</span>
              )}
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-800 p-4 text-center text-gray-500 dark:text-gray-400 z-50">
          No books found. Try a different search.
        </div>
      )}
    </div>
  );
}
