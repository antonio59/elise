"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchBooks, BookResult } from "@/lib/bookSearch";
import { Search, Loader2, Book, Plus, Star, BookOpen } from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  cardHover,
  scaleIn,
} from "@/lib/motion";

type BookSearchGridProps = {
  onSelectBook: (book: BookResult) => void;
  placeholder?: string;
};

export default function BookSearchGrid({
  onSelectBook,
  placeholder = "Search for a book by title, author, or ISBN...",
}: BookSearchGridProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const books = await searchBooks(query);
      setResults(books);
      setLoading(false);
      setHasSearched(true);
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-4 pl-12 text-lg rounded-xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          {loading ? (
            <Loader2 size={22} className="animate-spin text-emerald-500" />
          ) : (
            <Search size={22} />
          )}
        </span>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setHasSearched(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        {loading && query.length >= 2 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-2" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-1" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
              </div>
            ))}
          </motion.div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Book
              size={48}
              className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4"
            />
            <p className="text-neutral-500 dark:text-neutral-400">
              No books found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
              Try a different title or author name
            </p>
          </motion.div>
        )}

        {!loading && results.length > 0 && (
          <motion.div
            key="results"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {results.map((book) => (
              <BookCoverCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
              />
            ))}
          </motion.div>
        )}

        {!loading && !hasSearched && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen
              size={48}
              className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4"
            />
            <p className="text-neutral-500 dark:text-neutral-400">
              Start typing to search for books
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
              Search by title, author, or ISBN
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BookCoverCard({
  book,
  onSelect,
}: {
  book: BookResult;
  onSelect: (book: BookResult) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.button
      variants={staggerItem}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(book)}
      className="group text-left relative"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 shadow-md group-hover:shadow-xl transition-shadow">
        {book.coverUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-neutral-400" />
              </div>
            )}
            <img
              src={book.coverUrlLarge || book.coverUrl}
              alt={book.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Book
              size={32}
              className="text-neutral-400 dark:text-neutral-500 mb-2"
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3">
              {book.title}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <div className="flex items-center justify-center gap-2 text-white">
            <Plus size={18} />
            <span className="text-sm font-medium">Add to Shelf</span>
          </div>
        </div>

        {/* Source Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm ${
            book.source === "google"
              ? "bg-blue-500/80 text-white"
              : "bg-amber-500/80 text-white"
          }`}
        >
          {book.source === "google" ? "Google" : "Open Library"}
        </div>
      </div>

      {/* Book Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
          {book.authors.join(", ")}
        </p>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          {book.publishedDate && (
            <span>{book.publishedDate.split("-")[0]}</span>
          )}
          {book.pageCount && <span>{book.pageCount}p</span>}
        </div>
      </div>
    </motion.button>
  );
}
