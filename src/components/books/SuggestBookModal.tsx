import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Send,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CoverImage from "../CoverImage";
import { getVisitorId } from "../../lib/visitorId";

interface SuggestBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookSearchResult {
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
}

const GENRES = [
  "Manga",
  "Manhwa",
  "Webtoon",
  "Light Novel",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Horror",
  "Slice of Life",
  "Action",
  "Comedy",
  "Drama",
  "Other",
];

const SuggestBookModal: React.FC<SuggestBookModalProps> = ({
  isOpen,
  onClose,
}) => {
  const submitSuggestion = useMutation(api.bookSuggestions.submit);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null,
  );

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [suggestedBy, setSuggestedBy] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search using Open Library API
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=5&fields=title,author_name,cover_i,subject,number_of_pages_median`,
        );
        const data = await response.json();

        const results: BookSearchResult[] = (data.docs || []).map(
          (doc: {
            title?: string;
            author_name?: string[];
            cover_i?: number;
            subject?: string[];
            number_of_pages_median?: number;
          }) => ({
            title: doc.title || "Unknown Title",
            author: doc.author_name?.[0] || "Unknown Author",
            coverUrl: doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : undefined,
            genre: doc.subject?.[0] || undefined,
            pageCount: doc.number_of_pages_median || undefined,
          }),
        );

        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch {
        console.error("Search failed");
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectBook = (book: BookSearchResult) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCoverUrl(book.coverUrl || "");
    setGenre(book.genre || "");
    setSearchQuery("");
    setShowResults(false);
  };

  const clearSelection = () => {
    setSelectedBook(null);
    setTitle("");
    setAuthor("");
    setCoverUrl("");
    setGenre("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !suggestedBy.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitSuggestion({
        title: title.trim(),
        author: author.trim(),
        coverUrl: coverUrl.trim() || undefined,
        genre: genre || undefined,
        suggestedBy: suggestedBy.trim(),
        reason: reason.trim() || undefined,
        visitorId: getVisitorId(),
      });
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedBook(null);
      setTitle("");
      setAuthor("");
      setCoverUrl("");
      setGenre("");
      setSuggestedBy("");
      setReason("");
      setSubmitted(false);
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        <motion.div
          className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Suggest a Book
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-600" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Thank you!
              </h3>
              <p className="text-slate-600 mb-6">
                Your book suggestion has been submitted. I&apos;ll check it out soon!
              </p>
              <button onClick={handleClose} className="btn btn-primary">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Book Search */}
              {!selectedBook && (
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Search for a book
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input pl-10"
                      placeholder="Type a book title to search..."
                      autoFocus
                    />
                    {searching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 animate-spin" />
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {showResults && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-auto">
                      {searchResults.map((book, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectBook(book)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 transition-colors text-left border-b border-slate-100 last:border-0"
                        >
                          <CoverImage
                            book={book}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate">
                              {book.title}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              {book.author}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-2">
                    Can&apos;t find your book? Fill in the details below manually.
                  </p>
                </div>
              )}

              {/* Selected Book Preview */}
              {selectedBook && (
                <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
                  <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <CoverImage
                      book={selectedBook}
                      className="w-full h-full object-cover rounded-lg shadow"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">
                      {selectedBook.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      by {selectedBook.author}
                    </p>
                    {selectedBook.genre && (
                      <span className="inline-block mt-2 px-2 py-1 bg-white text-xs font-medium text-primary-600 rounded-full">
                        {selectedBook.genre}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="p-1 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              )}

              {/* Manual Entry Fields (collapsed if book selected) */}
              {!selectedBook && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input"
                      placeholder="The name of the book"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="input"
                      placeholder="Who wrote it?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Genre
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="input"
                    >
                      <option value="">Select genre</option>
                      {GENRES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={suggestedBy}
                  onChange={(e) => setSuggestedBy(e.target.value)}
                  className="input"
                  placeholder="What should I call you?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Why should I read it? (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input"
                  rows={2}
                  placeholder="Tell me why you think I'd like this book!"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !title.trim() ||
                  !author.trim() ||
                  !suggestedBy.trim()
                }
                className="btn btn-primary w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Suggestion
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SuggestBookModal;
