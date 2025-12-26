"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchBooks, BookResult } from "@/lib/bookSearch";
import { Search, Loader2, Book, Plus, BookOpen, Sparkles } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

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
          className="w-full px-5 py-4 pl-14 text-base rounded-2xl border-2 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
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
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-200 dark:bg-neutral-700 rounded-lg transition-colors"
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
                <div className="aspect-[2/3] bg-gray-200 dark:bg-neutral-700 rounded-2xl mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded-lg w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-lg w-1/2" />
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
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
              <Book size={36} className="text-gray-300 dark:text-neutral-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No books found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
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
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center"
            >
              <BookOpen size={40} className="text-emerald-500" />
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Start typing to search for books
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
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
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(book)}
      className="group text-left relative"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 shadow-md group-hover:shadow-xl transition-all duration-300 ring-2 ring-transparent group-hover:ring-emerald-500/50">
        {book.coverUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-neutral-600 border-t-emerald-500 animate-spin" />
              </div>
            )}
            <img
              src={book.coverUrlLarge || book.coverUrl}
              alt={book.title}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <Book
              size={32}
              className="text-emerald-400 dark:text-emerald-500 mb-2"
            />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium line-clamp-3">
              {book.title}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2 text-white"
          >
            <div className="p-2 bg-emerald-500 rounded-full">
              <Plus size={16} />
            </div>
            <span className="text-sm font-semibold">Add to Shelf</span>
          </motion.div>
        </div>

        {/* Source Badge */}
        <div
          className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md ${
            book.source === "google"
              ? "bg-blue-500/90 text-white"
              : "bg-amber-500/90 text-white"
          }`}
        >
          {book.source === "google" ? "Google" : "OpenLib"}
        </div>
      </div>

      {/* Book Info */}
      <div className="mt-3 space-y-1 px-1">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
          {book.authors.join(", ")}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {book.publishedDate && (
            <span className="bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
              {book.publishedDate.split("-")[0]}
            </span>
          )}
          {book.pageCount && (
            <span className="bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
              {book.pageCount}p
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
