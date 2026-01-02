import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  BookOpen,
  Sparkles,
  X,
  MessageSquarePlus,
  Loader2,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Generate consistent gradient colors for books without covers
function getBookGradient(title: string): [string, string] {
  const colors: [string, string][] = [
    ["#f472b6", "#e879f9"], // pink to fuchsia
    ["#a78bfa", "#818cf8"], // violet to indigo
    ["#60a5fa", "#38bdf8"], // blue to sky
    ["#34d399", "#2dd4bf"], // emerald to teal
    ["#fbbf24", "#fb923c"], // amber to orange
    ["#f87171", "#fb7185"], // red to rose
    ["#a3e635", "#4ade80"], // lime to green
    ["#22d3ee", "#818cf8"], // cyan to indigo
  ];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

interface WishlistBook {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
  giftedBy?: string;
}

const PublicWishlist: React.FC = () => {
  const wishlistBooks = (useQuery(api.books.getWishlist) ??
    []) as WishlistBook[];

  const [selectedBook, setSelectedBook] = useState<WishlistBook | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  // Sort alphabetically by title
  const sortedWishlist = [...wishlistBooks].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const totalPages = wishlistBooks.reduce(
    (sum, book) => sum + (book.pageCount || 0),
    0,
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 shadow-lg flex items-center justify-center">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800">
                  My Reading Wishlist
                </h1>
                <p className="text-slate-500 mt-1">
                  Books I can't wait to read!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
                  {wishlistBooks.length}
                </span>
                <span className="text-sm text-slate-500">books</span>
              </div>
              {totalPages > 0 && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                  <BookOpen className="w-4 h-4 text-accent-500" />
                  <span className="text-lg font-bold text-accent-600">
                    {totalPages.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500">pages</span>
                </div>
              )}
              <button
                onClick={() => setShowSuggestModal(true)}
                className="btn btn-gradient"
              >
                <MessageSquarePlus className="w-5 h-5" />
                Suggest a Book
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="py-8 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {sortedWishlist.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {sortedWishlist.map((book) => {
                const [color1, color2] = getBookGradient(book.title);
                return (
                  <motion.div
                    key={book._id}
                    className="cursor-pointer group"
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.9 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        },
                      },
                    }}
                    onClick={() => setSelectedBook(book)}
                  >
                    <motion.div
                      className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all"
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center p-4 text-white"
                          style={{
                            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
                          }}
                        >
                          <span className="text-4xl mb-3">🎁</span>
                          <span className="text-sm font-bold text-center leading-tight line-clamp-3">
                            {book.title}
                          </span>
                        </div>
                      )}

                      {/* Wishlist badge */}
                      <div className="absolute top-2 left-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Gift className="w-4 h-4 text-white" />
                      </div>

                      {/* Hover overlay with title */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
                          {book.title}
                        </p>
                        <p className="text-white/70 text-xs mt-1">
                          {book.author}
                        </p>
                      </div>

                      {/* Sparkle on hover */}
                      <div className="absolute top-2 right-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        ✨
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-4"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">🎁</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                My Wishlist is Empty!
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                I'm always looking for new books to read! Have a suggestion?
              </p>
              <button
                onClick={() => setShowSuggestModal(true)}
                className="btn btn-gradient"
              >
                <MessageSquarePlus className="w-5 h-5" />
                Suggest a Book
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              {/* Cover */}
              <div className="relative h-72 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
                {selectedBook.coverUrl ? (
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="h-56 w-auto shadow-2xl rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="h-56 w-40 shadow-2xl flex items-center justify-center text-white p-4 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${getBookGradient(selectedBook.title)[0]} 0%, ${getBookGradient(selectedBook.title)[1]} 100%)`,
                    }}
                  >
                    <span className="text-xl font-bold text-center">
                      {selectedBook.title}
                    </span>
                  </div>
                )}

                {/* Wishlist badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-pink-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-semibold">On My Wishlist</span>
                </div>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  {selectedBook.title}
                </h2>
                <p className="text-slate-500 mb-4">by {selectedBook.author}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBook.genre && (
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-violet-100 text-violet-600">
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.pageCount && selectedBook.pageCount > 0 && (
                    <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {selectedBook.pageCount} pages
                    </span>
                  )}
                </div>

                {selectedBook.description && (
                  <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 mb-6">
                    <h3 className="font-bold text-slate-700 mb-2 text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary-500" />
                      About this book
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedBook.description}
                    </p>
                  </div>
                )}

                {selectedBook.giftedBy && (
                  <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 mb-6">
                    <p className="text-slate-600 text-sm">
                      <span className="font-medium">Suggested by:</span>{" "}
                      {selectedBook.giftedBy}
                    </p>
                  </div>
                )}

                {!selectedBook.description && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                    <p className="text-slate-500 italic text-center">
                      This book looks amazing and I can't wait to read it!
                    </p>
                  </div>
                )}

                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-slate-400 text-sm">
                    Know someone who has this book? Let them know I'd love to
                    borrow it!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [suggestedBy, setSuggestedBy] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !suggestedBy.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitSuggestion({
        title: title.trim(),
        author: author.trim(),
        genre: genre || undefined,
        suggestedBy: suggestedBy.trim(),
        suggestedByEmail: email.trim() || undefined,
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
      setTitle("");
      setAuthor("");
      setGenre("");
      setSuggestedBy("");
      setEmail("");
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
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
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
                  Your Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="If you want me to let you know if I read it!"
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
                  rows={3}
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
                className="btn btn-gradient w-full"
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

export default PublicWishlist;
