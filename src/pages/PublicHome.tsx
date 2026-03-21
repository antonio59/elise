import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Palette,
  Heart,
  Star,
  MessageSquarePlus,
  X,
  Loader2,
  Send,
  CheckCircle,
  AlertCircle,
  Search,
  Feather,
  BookHeart,
  BookOpenText,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Fix HTML-encoded URLs (Google Books stores &amp; instead of &)
function fixCoverUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/&amp;/g, "&");
}

const PublicHome: React.FC = () => {
  const books = useQuery(api.books.getReadBooks) ?? [];
  const artworks = useQuery(api.artworks.getPublished, { limit: 6 }) ?? [];
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const totalBooks = books.length;
  const totalPages = books.reduce((sum, b) => sum + (b.pageCount || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-slate-900">
              Elise Reads
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto mb-10 font-light italic">
              books I've read, art I make, and words I write
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <a href="#books" className="btn btn-primary">
                <BookOpen className="w-4 h-4" />
                Books
              </a>
              <Link to="/gallery" className="btn btn-secondary">
                <Palette className="w-4 h-4" />
                Art
              </Link>
              <a href="#writing" className="btn btn-secondary">
                <Feather className="w-4 h-4" />
                Writing
              </a>
              <button
                onClick={() => setShowSuggestModal(true)}
                className="btn btn-secondary"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Suggest
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Currently Reading + Bio */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Currently Reading */}
          <div className="card p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Currently Reading</h2>
            <div className="flex gap-4">
              <div className="w-16 h-24 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary-300" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Add your current book</p>
                <p className="text-sm text-slate-500 mt-1">
                  Mark a book as "reading" from your dashboard to show it here.
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="card p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">About</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hi, I'm Elise. I'm 13 and I love reading manga, fantasy, and anything with a plot twist I don't see coming. 
              I also draw and write when I'm not buried in a book.
            </p>
          </div>
        </div>
      </section>

      {/* Stats — only show when there are books */}
      {totalBooks > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                className="stat-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {totalBooks}
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Books Read</div>
              </motion.div>

              <motion.div
                className="stat-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {totalPages.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Pages</div>
              </motion.div>

              <motion.div
                className="stat-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {artworks.length}
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Artworks</div>
              </motion.div>

              <motion.div
                className="stat-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {books.filter((b) => b.rating && b.rating >= 4).length}
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Favourites</div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* 5-Star Shelf — horizontal scroll of top-rated books */}
      {books.filter((b) => b.rating === 5).length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">5-Star Shelf</h2>
            <div className="shelf-scroll">
              {books
                .filter((b) => b.rating === 5)
                .map((book) => (
                  <div key={book._id} className="w-28 sm:w-32">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-100 shadow-sm">
                      {book.coverUrl ? (
                        <img
                          src={fixCoverUrl(book.coverUrl)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-50">
                          <BookHeart className="w-6 h-6 text-primary-300" />
                        </div>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-slate-700 line-clamp-1">
                      {book.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Books Section */}
      <section id="books" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Books</h2>
            <p className="text-slate-500 mt-1">
              everything I've been reading
            </p>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No books yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {books.map((book, index) => (
                <motion.div
                  key={book._id}
                  className="group book-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-md book-spine">
                    {fixCoverUrl(book.coverUrl) ? (
                      <img
                        src={fixCoverUrl(book.coverUrl)}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                        <BookOpen className="w-8 h-8 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {book.author}
                  </p>
                  {book.rating && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < book.rating!
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-primary-500 ml-1">
                        {["not it", "meh", "solid read", "obsessed", "all-time fav"][book.rating - 1]}
                      </span>
                    </div>
                  )}
                  {book.review && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">
                      "{book.review}"
                    </p>
                  )}
                  {book.moodTags && book.moodTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.moodTags.slice(0, 3).map((tag) => (
                        <span key={tag} className="mood-tag">
                          {tag}
                        </span>
                      ))}
                      {book.moodTags.length > 3 && (
                        <span className="text-xs text-slate-400">+{book.moodTags.length - 3}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Art Gallery Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Art</h2>
            <Link
              to="/gallery"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              View gallery →
            </Link>
          </div>

          {artworks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {artworks.slice(0, 6).map((art, index) => (
                <motion.div
                  key={art._id}
                  className="group relative aspect-square rounded-xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h3 className="text-white font-bold text-sm">{art.title}</h3>
                      {art.likes && art.likes > 0 && (
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <Heart className="w-3 h-3" />
                          {art.likes}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Palette className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Artwork coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Writings Preview */}
      <PublicWritings />

      {/* Reviews Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Reviews</h2>
          </div>
          <ReviewStrip books={books} />
        </div>
      </section>

      {/* Suggest a Book Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <MessageSquarePlus className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-slate-600">
                Have a book idea?
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Got a recommendation?
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
              Read something good lately? Drop it here.
            </p>

            <button
              onClick={() => setShowSuggestModal(true)}
              className="btn btn-gradient"
            >
              <MessageSquarePlus className="w-5 h-5" />
              Suggest a Book
            </button>
          </motion.div>
        </div>
      </section>

      {/* Suggest Book Modal */}
      <SuggestBookModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
};

// Suggest Book Modal Component
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
                Your book suggestion has been submitted. I'll check it out soon!
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
                          {book.coverUrl ? (
                            <img
                              src={fixCoverUrl(book.coverUrl)}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-slate-100 rounded flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
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

                  <p className="text-xs text-slate-400 mt-2">
                    Can't find your book? Fill in the details below manually.
                  </p>
                </div>
              )}

              {/* Selected Book Preview */}
              {selectedBook && (
                <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
                  {selectedBook.coverUrl ? (
                    <img
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      className="w-16 h-24 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-slate-200 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
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

export default PublicHome;

// ===== PUBLIC WRITINGS SECTION =====
const PublicWritings: React.FC = () => {
  const writings = useQuery(api.writings.getPublished, { limit: 6 }) ?? [];

  const typeConfig: Record<string, { icon: typeof Feather; color: string; label: string }> = {
    poetry: { icon: Feather, color: "text-violet-500", label: "Poetry" },
    story: { icon: BookHeart, color: "text-primary-500", label: "Story" },
    journal: { icon: BookOpenText, color: "text-accent-500", label: "Journal" },
  };

  return (
    <section id="writing" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Writing</h2>
        </div>

        {writings.length === 0 ? (
          <div className="card p-10 text-center max-w-lg mx-auto">
            <Feather className="w-8 h-8 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">Coming soon</h3>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
            </p>
            <p className="text-xs text-slate-400 mt-3">— Dr. Seuss</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {writings.map((writing, index) => {
            const config = typeConfig[writing.type] || typeConfig.story;
            const Icon = config.icon;
            const preview = writing.content.slice(0, 120) + "...";

            return (
              <motion.div
                key={writing._id}
                className="card p-5 hover:border-violet-200 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-primary-100 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-500 capitalize">
                    {config.label}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{writing.title}</h3>
                <p className="text-sm text-slate-600 italic line-clamp-3 leading-relaxed">
                  {preview}
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  {writing.wordCount} words · {new Date(writing.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
};

const ReviewStrip: React.FC<{ books: Array<{ _id: string; title: string; author: string; coverUrl?: string; rating?: number; review?: string; isFavorite?: boolean }> }> = ({ books }) => {
  const reviewed = books.filter((b) => b.rating && b.rating > 0);

  if (reviewed.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Star className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500">No reviews yet — stay tuned!</p>
      </div>
    );
  }

  const RATING_LABELS: Record<number, string> = {
    1: "not it", 2: "meh", 3: "solid read", 4: "obsessed", 5: "all-time fav",
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {reviewed.map((book) => (
        <motion.div
          key={book._id}
          className="card p-4 min-w-[260px] flex-shrink-0 hover:shadow-lg transition-shadow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-3">
            <div className="w-16 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              {fixCoverUrl(book.coverUrl) ? (
                <img
                  src={fixCoverUrl(book.coverUrl)}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                  <BookOpen className="w-5 h-5 text-primary-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{book.title}</h3>
              <p className="text-xs text-slate-500 mb-1">{book.author}</p>
              <div className="flex items-center gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < (book.rating ?? 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-400 ml-1">{RATING_LABELS[book.rating ?? 0]}</span>
              </div>
              {book.review && (
                <p className="text-xs text-slate-500 line-clamp-3 italic leading-relaxed">
                  "{book.review}"
                </p>
              )}
              {book.isFavorite && (
                <span className="inline-flex items-center gap-1 text-xs text-red-400 font-medium mt-1">
                  <Heart className="w-3 h-3 fill-red-400" />
                  Fav
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
