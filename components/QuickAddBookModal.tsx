"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api, useAuth } from "@/lib/convex";
import { BookResult } from "@/lib/bookSearch";
import { GENRES } from "@/lib/types";
import { overlayVariants, modalVariants } from "@/lib/motion";
import {
  X,
  Book,
  Star,
  Heart,
  BookOpen,
  Check,
  Sparkles,
  Loader2,
  Calendar,
  FileText,
  Tag,
  Building2,
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
  bgColor: string;
}[] = [
  {
    value: "reading",
    label: "Reading",
    icon: <BookOpen size={20} />,
    color: "text-sky-600",
    bgColor: "bg-sky-500",
  },
  {
    value: "read",
    label: "Finished",
    icon: <Check size={20} />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500",
  },
  {
    value: "wishlist",
    label: "Want to Read",
    icon: <Heart size={20} />,
    color: "text-pink-600",
    bgColor: "bg-pink-500",
  },
];

// Smart genre detection from book categories/subjects
function detectGenre(book: BookResult): string {
  const categories = book.categories || [];
  const description = book.description?.toLowerCase() || "";
  const title = book.title.toLowerCase();

  // Build a string of all available metadata to search
  const searchText = [...categories, description, title]
    .join(" ")
    .toLowerCase();

  // Genre detection rules (ordered by specificity)
  const genreRules: { genre: string; keywords: string[] }[] = [
    {
      genre: "Manga",
      keywords: ["manga", "japanese comic", "shonen jump", "viz media"],
    },
    {
      genre: "Manhwa",
      keywords: ["manhwa", "korean comic", "webtoon", "line webtoon"],
    },
    { genre: "Manhua", keywords: ["manhua", "chinese comic"] },
    { genre: "Webtoon", keywords: ["webtoon", "webcomic", "web comic"] },
    { genre: "Light Novel", keywords: ["light novel", "ln", "ranobe"] },
    {
      genre: "Isekai",
      keywords: [
        "isekai",
        "reincarnated",
        "transported to another world",
        "summoned to another world",
      ],
    },
    {
      genre: "Shounen",
      keywords: ["shonen", "shounen", "young boys", "action adventure"],
    },
    {
      genre: "Shoujo",
      keywords: ["shojo", "shoujo", "young girls", "magical girl"],
    },
    { genre: "Seinen", keywords: ["seinen", "young men", "mature"] },
    { genre: "Josei", keywords: ["josei", "young women"] },
    {
      genre: "Fantasy",
      keywords: [
        "fantasy",
        "magic",
        "wizard",
        "dragon",
        "sword",
        "medieval",
        "kingdom",
        "elves",
        "dwarves",
      ],
    },
    {
      genre: "Sci-Fi",
      keywords: [
        "science fiction",
        "sci-fi",
        "scifi",
        "space",
        "future",
        "robot",
        "cyberpunk",
        "dystopian",
      ],
    },
    {
      genre: "Romance",
      keywords: ["romance", "love story", "romantic", "love triangle"],
    },
    {
      genre: "Mystery",
      keywords: [
        "mystery",
        "detective",
        "crime",
        "thriller",
        "suspense",
        "whodunit",
      ],
    },
    {
      genre: "Horror",
      keywords: [
        "horror",
        "scary",
        "supernatural",
        "ghost",
        "haunted",
        "creepy",
      ],
    },
    {
      genre: "Sports",
      keywords: [
        "sports",
        "basketball",
        "soccer",
        "baseball",
        "volleyball",
        "tennis",
        "swimming",
      ],
    },
    {
      genre: "Slice of Life",
      keywords: ["slice of life", "daily life", "everyday", "coming of age"],
    },
    {
      genre: "Adventure",
      keywords: ["adventure", "quest", "journey", "exploration"],
    },
    {
      genre: "Non-Fiction",
      keywords: [
        "non-fiction",
        "nonfiction",
        "biography",
        "history",
        "science",
        "educational",
      ],
    },
    {
      genre: "Biography",
      keywords: ["biography", "autobiography", "memoir", "life story"],
    },
  ];

  for (const rule of genreRules) {
    if (rule.keywords.some((keyword) => searchText.includes(keyword))) {
      return rule.genre;
    }
  }

  // Fallback: check if any GENRES match directly in categories
  for (const genre of GENRES) {
    if (
      categories.some((cat) => cat.toLowerCase().includes(genre.toLowerCase()))
    ) {
      return genre;
    }
  }

  return "";
}

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

  // Auto-detect genre when book changes
  useEffect(() => {
    if (book) {
      const detectedGenre = detectGenre(book);
      setGenre(detectedGenre);
    }
  }, [book]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && book) {
      setStatus("reading");
      setRating(0);
      setIsFavorite(false);
      setLoading(false);
      setError("");
      setSuccess(false);
      setAddedBookId(null);
      // Re-detect genre on open
      setGenre(detectGenre(book));
    }
  }, [isOpen, book]);

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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors shadow-sm"
            >
              <X size={18} />
            </button>

            {/* Book Cover Header - Gradient Background */}
            <div className="relative h-52 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-white/10 rounded-full" />

              {/* Book Cover */}
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrlLarge || book.coverUrl}
                      alt={book.title}
                      className="h-44 w-auto rounded-xl shadow-2xl ring-4 ring-white/30"
                    />
                  ) : (
                    <div className="h-44 w-32 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center ring-4 ring-white/30">
                      <Book size={48} className="text-white/60" />
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
                    <div className="text-center mb-5">
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1 line-clamp-2">
                        {book.title}
                      </h2>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        by {book.authors.join(", ")}
                      </p>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap justify-center gap-2 mb-5">
                      {book.publishedDate && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs">
                          <Calendar size={12} />
                          {book.publishedDate.split("-")[0]}
                        </span>
                      )}
                      {book.pageCount && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs">
                          <FileText size={12} />
                          {book.pageCount} pages
                        </span>
                      )}
                      {book.publisher && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs">
                          <Building2 size={12} />
                          {book.publisher}
                        </span>
                      )}
                      {genre && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                          <Tag size={12} />
                          {genre}
                        </span>
                      )}
                    </div>

                    {/* Status Selection */}
                    <div className="mb-5">
                      <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                        Reading Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setStatus(option.value)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                              status === option.value
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm"
                                : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600"
                            }`}
                          >
                            <span
                              className={`p-2 rounded-xl ${status === option.value ? option.bgColor : "bg-neutral-100 dark:bg-neutral-700"} text-white`}
                            >
                              {option.icon}
                            </span>
                            <span
                              className={`text-xs font-medium ${status === option.value ? option.color + " dark:text-emerald-400" : "text-neutral-600 dark:text-neutral-400"}`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating (only for read books) */}
                    <AnimatePresence>
                      {status === "read" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-5 overflow-hidden"
                        >
                          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                            Your Rating
                          </label>
                          <div className="flex justify-center gap-1 bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-1"
                              >
                                <Star
                                  size={28}
                                  className={`transition-colors ${
                                    star <= rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-neutral-300 dark:text-neutral-600"
                                  }`}
                                />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Genre Selection (if not auto-detected) */}
                    {!genre && (
                      <div className="mb-5">
                        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                          Genre
                        </label>
                        <select
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select genre...</option>
                          {GENRES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Favorite Toggle */}
                    <label className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isFavorite}
                        onChange={(e) => setIsFavorite(e.target.checked)}
                        className="sr-only"
                      />
                      <motion.div
                        animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
                        className={`p-2 rounded-xl transition-colors ${isFavorite ? "bg-pink-500" : "bg-neutral-200 dark:bg-neutral-700 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-600"}`}
                      >
                        <Heart
                          size={18}
                          className={
                            isFavorite
                              ? "fill-white text-white"
                              : "text-neutral-500"
                          }
                        />
                      </motion.div>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Add to Favorites
                      </span>
                    </label>

                    {/* Error Message */}
                    {error && (
                      <p className="text-red-500 text-sm text-center mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        {error}
                      </p>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Adding to shelf...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Add to My Bookshelf
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
                    >
                      <Sparkles size={36} className="text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                        Added to Your Shelf!
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                        &ldquo;{book.title}&rdquo; is ready to read
                      </p>
                    </motion.div>

                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleAction("shelf")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-4 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        View Bookshelf
                      </motion.button>
                      <motion.button
                        onClick={() => handleAction("review")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
                      >
                        <Star size={18} />
                        Write Review
                      </motion.button>
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
