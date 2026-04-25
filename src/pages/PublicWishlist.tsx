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
  Share2,
  Check,
  ShoppingBag,
} from "lucide-react";
import CoverImage from "../components/CoverImage";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import PageHeader from "../components/PageHeader";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { getVisitorId } from "../lib/visitorId";
import { BookGridSkeleton } from "../components/Skeleton";

interface WishlistBook {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
  giftedBy?: string;
  boughtBy?: string;
  boughtAt?: number;
}

const PublicWishlist: React.FC = () => {
  usePageAnnouncement("Wishlist");
  usePageMeta({ title: "Wishlist", description: "Books I'd love to read" });
  const wishlistBooksRaw = useQuery(api.books.getWishlist);
  const wishlistBooks = (wishlistBooksRaw ?? []) as WishlistBook[];

  const [selectedBook, setSelectedBook] = useState<WishlistBook | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [buyingBookId, setBuyingBookId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyError, setBuyError] = useState("");
  const [buySuccess, setBuySuccess] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const markAsBought = useMutation(api.books.markWishlistAsBought);

  const handleMarkAsBought = async (bookId: string) => {
    if (!buyerName.trim()) {
      setBuyError("Please enter your name");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await markAsBought({ id: bookId as any, boughtBy: buyerName.trim(), visitorId: getVisitorId() });
      setBuySuccess(true);
      setTimeout(() => {
        setBuyingBookId(null);
        setBuyerName("");
        setBuyError("");
        setBuySuccess(false);
      }, 2000);
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/wishlist`;
    const shareData = {
      title: "Elise's Reading Wishlist",
      text: "Check out Elise's reading wishlist! Know a great book? Suggest one!",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  // Sort alphabetically by title
  const sortedWishlist = [...wishlistBooks].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const totalPages = wishlistBooks.reduce(
    (sum, book) => sum + (book.pageCount || 0),
    0,
  );

  const actions = (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm border border-slate-200">
        <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          {wishlistBooks.length}
        </span>
        <span className="text-sm text-slate-500">books</span>
      </div>
      {totalPages > 0 && (
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <BookOpen className="w-4 h-4 text-primary-500" />
          <span className="text-lg font-bold text-primary-600">
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
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 font-medium rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
      >
        {shareStatus === "copied" ? (
          <>
            <Check className="w-4 h-4 text-success-500" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Share
          </>
        )}
      </button>
    </div>
  );

  if (wishlistBooksRaw === undefined) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <PageHeader
          badge="Wishlist"
          title="My Reading Wishlist"
          subtitle="Books I can't wait to read!"
          breadcrumbs={[{ label: "Wishlist" }]}
        />
        <BookGridSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <PageHeader
        badge="Wishlist"
        title="My Reading Wishlist"
        subtitle="Books I can't wait to read!"
        breadcrumbs={[{ label: "Wishlist" }]}
        actions={actions}
      />
          {sortedWishlist.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6"
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
                      <CoverImage book={book} className="w-full h-full object-cover" />

                      {/* Bought overlay */}
                      {book.boughtBy ? (
                        <div className="absolute inset-0 bg-green-900/60 flex flex-col items-center justify-center">
                          <div className="bg-success-500 rounded-full p-2 mb-2 shadow-lg">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white text-xs font-bold drop-shadow">Bought!</span>
                          <span className="text-white/80 text-[10px] mt-0.5 drop-shadow">
                            by {book.boughtBy}
                          </span>
                        </div>
                      ) : (
                        <>
                          {/* Wishlist badge */}
                          <div className="absolute top-2 left-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
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
                        </>
                      )}
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
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-8">
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
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            />

            <motion.div
              className="relative bg-slate-50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              {/* Cover */}
              <div className="relative h-72 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
                <div className="h-56 w-40 shadow-2xl rounded-lg overflow-hidden">
                  <CoverImage book={selectedBook} className="h-full w-full object-cover" />
                </div>

                {/* Wishlist badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-semibold">On My Wishlist</span>
                </div>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
                  aria-label="Close book detail"
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
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-accent-100 text-accent-600">
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

                {/* Bought status / Buy button */}
                <div className="pt-4 border-t border-slate-200">
                  {selectedBook.boughtBy ? (
                    <div className="flex items-center gap-3 bg-success-50 rounded-xl p-4 border border-success-200">
                      <div className="bg-success-500 rounded-full p-2">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-success-700 font-semibold text-sm">Someone got this!</p>
                        <p className="text-success-600 text-xs">
                          Bought by {selectedBook.boughtBy}
                        </p>
                      </div>
                    </div>
                  ) : buyingBookId === selectedBook._id ? (
                    <div className="space-y-3">
                      {buySuccess ? (
                        <div className="flex items-center gap-2 justify-center bg-success-50 rounded-xl p-4">
                          <Check className="w-5 h-5 text-success-500" />
                          <span className="text-success-700 font-semibold">Thank you!</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-slate-500 text-center">
                            Enter your name so we know who's getting this book!
                          </p>
                          <input
                            type="text"
                            value={buyerName}
                            onChange={(e) => { setBuyerName(e.target.value); setBuyError(""); }}
                            placeholder="Your name"
                            className="input"
                            autoFocus
                          />
                          {buyError && (
                            <p className="text-error-500 text-xs">{buyError}</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMarkAsBought(selectedBook._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success-500 hover:bg-success-600 text-white font-semibold rounded-lg transition-colors text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Confirm
                            </button>
                            <button
                              onClick={() => { setBuyingBookId(null); setBuyerName(""); setBuyError(""); }}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => setBuyingBookId(selectedBook._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      I Bought This!
                    </motion.button>
                  )}
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
          className="absolute inset-0 bg-slate-900/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        <motion.div
          className="relative bg-slate-50 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
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
                aria-label="Close suggest modal"
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
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success-600" />
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
