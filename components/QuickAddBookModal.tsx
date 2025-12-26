"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api, useAuth } from "@/lib/convex";
import { BookResult } from "@/lib/bookSearch";
import { GENRES } from "@/lib/types";
import { overlayVariants, modalVariants, scaleIn } from "@/lib/motion";
import {
  X,
  Book,
  Star,
  Heart,
  BookOpen,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";

type QuickAddBookModalProps = {
  book: BookResult | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookId: string, action: "shelf" | "review") => void;
};

type BookStatus = "reading" | "read" | "wishlist";

const statusOptions: {
  value: BookStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "reading",
    label: "Currently Reading",
    icon: <BookOpen size={20} />,
    color: "bg-sky-500",
  },
  {
    value: "read",
    label: "Already Read",
    icon: <Check size={20} />,
    color: "bg-emerald-500",
  },
  {
    value: "wishlist",
    label: "Want to Read",
    icon: <Heart size={20} />,
    color: "bg-pink-500",
  },
];

export default function QuickAddBookModal({
  book,
  isOpen,
  onClose,
  onSuccess,
}: QuickAddBookModalProps) {
  const { token } = useAuth();
  const [status, setStatus] = useState<BookStatus>("reading");
  const [rating, setRating] = useState(0);
  const [genre, setGenre] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [addedBookId, setAddedBookId] = useState<string | null>(null);

  const createBook = useMutation(api.books.create);

  // Auto-detect genre from book categories
  useEffect(() => {
    if (book?.categories) {
      const matchedGenre = GENRES.find((g) =>
        book.categories?.some((c) => c.toLowerCase().includes(g.toLowerCase())),
      );
      if (matchedGenre) setGenre(matchedGenre);
    }
  }, [book]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStatus("reading");
      setRating(0);
      setIsFavorite(false);
      setLoading(false);
      setError("");
      setSuccess(false);
      setAddedBookId(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!token || !book) return;

    setLoading(true);
    setError("");

    try {
      const bookId = await createBook({
        token,
        title: book.title,
        author: book.authors.join(", "),
        coverUrl: book.coverUrlLarge || book.coverUrl,
        rating: status === "read" ? rating : undefined,
        status,
        genre: genre || undefined,
        pagesTotal: book.pageCount,
        isFavorite,
        published: true,
      });

      setSuccess(true);
      setAddedBookId(bookId);
    } catch (err: any) {
      setError(err.message || "Failed to add book");
      setLoading(false);
    }
  };

  const handleAction = (action: "shelf" | "review") => {
    if (addedBookId) {
      onSuccess(addedBookId, action);
    }
    onClose();
  };

  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Book Cover Header */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-teal-500 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrlLarge || book.coverUrl}
                      alt={book.title}
                      className="h-40 w-auto rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="h-40 w-28 bg-white/20 rounded-lg flex items-center justify-center">
                      <Book size={40} className="text-white/60" />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Book Info */}
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                        {book.title}
                      </h2>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        by {book.authors.join(", ")}
                      </p>
                      {book.pageCount && (
                        <p className="text-sm text-neutral-400 mt-1">
                          {book.pageCount} pages
                        </p>
                      )}
                    </div>

                    {/* Status Selection */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
                        Reading Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setStatus(option.value)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                              status === option.value
                                ? `border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20`
                                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                            }`}
                          >
                            <span
                              className={`p-2 rounded-full ${status === option.value ? option.color : "bg-neutral-100 dark:bg-neutral-800"} text-white`}
                            >
                              {option.icon}
                            </span>
                            <span
                              className={`text-xs font-medium ${status === option.value ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-600 dark:text-neutral-400"}`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating (only for read books) */}
                    {status === "read" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
                          Your Rating
                        </label>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={32}
                                className={`transition-colors ${
                                  star <= rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-neutral-300 dark:text-neutral-600"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Genre Selection */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                        Genre
                      </label>
                      <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      >
                        <option value="">Select genre...</option>
                        {GENRES.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Favorite Toggle */}
                    <label className="flex items-center gap-3 mb-6 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFavorite}
                        onChange={(e) => setIsFavorite(e.target.checked)}
                        className="w-5 h-5 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
                      />
                      <span className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <Heart
                          size={16}
                          className={
                            isFavorite ? "fill-pink-500 text-pink-500" : ""
                          }
                        />
                        Mark as Favorite
                      </span>
                    </label>

                    {/* Error Message */}
                    {error && (
                      <p className="text-red-500 text-sm text-center mb-4">
                        {error}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Adding to shelf...
                        </>
                      ) : (
                        <>
                          <Book size={20} />
                          Add to My Bookshelf
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Sparkles size={36} className="text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      Added to Your Shelf!
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                      &ldquo;{book.title}&rdquo; is now in your collection
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction("shelf")}
                        className="flex-1 py-3 px-4 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        View Bookshelf
                      </button>
                      <button
                        onClick={() => handleAction("review")}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Star size={18} />
                        Write Review
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
