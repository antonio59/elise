"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api, useAuth } from "@/lib/convex";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BookOpen,
  PenLine,
  ChevronRight,
  Loader2,
  Check,
  Sparkles,
  Heart,
  ArrowRight,
} from "lucide-react";
import { MOOD_COLORS } from "@/lib/types";

type Book = {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: "reading" | "read" | "wishlist";
};

type QuickReviewCardProps = {
  books: Book[];
};

const RATING_EMOJIS = [
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😊", label: "Great" },
  { emoji: "🤩", label: "Amazing" },
  { emoji: "🥰", label: "Favorite!" },
];

const moodOptions = Object.keys(MOOD_COLORS) as Array<keyof typeof MOOD_COLORS>;
const moodColorClasses: Record<string, string> = {
  sakura: "bg-pink-400",
  mint: "bg-emerald-400",
  sky: "bg-sky-400",
  kawaii: "bg-purple-400",
  gold: "bg-amber-400",
};

export default function QuickReviewCard({ books }: QuickReviewCardProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(0);
  const [mood, setMood] = useState<keyof typeof MOOD_COLORS>("sakura");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createReview = useMutation(api.reviews.create);

  // Filter to books that can be reviewed (reading or read)
  const reviewableBooks = books.filter(
    (b) => b.status === "reading" || b.status === "read",
  );

  const handleQuickPublish = async () => {
    if (!token || !selectedBook) return;

    setLoading(true);
    try {
      await createReview({
        token,
        bookTitle: selectedBook.title,
        author: selectedBook.author,
        rating,
        moodColor: mood,
        content,
        published: true,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedBook(null);
        setRating(0);
        setContent("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFullReview = () => {
    if (selectedBook) {
      router.push(
        `/write?book=${encodeURIComponent(selectedBook.title)}&author=${encodeURIComponent(selectedBook.author)}`,
      );
    } else {
      router.push("/write");
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedBook ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {reviewableBooks.length > 0 ? (
              <div className="space-y-4">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Select a book from your shelf to review:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {reviewableBooks.slice(0, 8).map((book) => (
                    <motion.button
                      key={book._id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBook(book)}
                      className="relative group text-left"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="text-neutral-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-white text-xs font-medium">
                            Review this
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs font-medium text-neutral-900 dark:text-white line-clamp-1">
                        {book.title}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {reviewableBooks.length > 8 && (
                  <button
                    onClick={() => router.push("/bookshelf")}
                    className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 flex items-center gap-1"
                  >
                    View all {reviewableBooks.length} books
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen
                  size={48}
                  className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4"
                />
                <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                  No books to review yet
                </p>
                <p className="text-sm text-neutral-400 mb-4">
                  Add books to your shelf first, then come back to write reviews
                </p>
                <button
                  onClick={handleFullReview}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <PenLine size={16} />
                  Write a review anyway
                </button>
              </div>
            )}
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles size={36} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Review Published!
            </h3>
            <p className="text-neutral-500">
              Your review for &ldquo;{selectedBook.title}&rdquo; is now live
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Selected Book Header */}
            <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              {selectedBook.coverUrl ? (
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-12 h-16 object-cover rounded-lg shadow"
                />
              ) : (
                <div className="w-12 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-neutral-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-neutral-900 dark:text-white truncate">
                  {selectedBook.title}
                </h4>
                <p className="text-sm text-neutral-500 truncate">
                  {selectedBook.author}
                </p>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Change
              </button>
            </div>

            {/* Quick Rating */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
                How did you like it?
              </label>
              <div className="flex justify-between gap-2">
                {RATING_EMOJIS.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      rating === i + 1
                        ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span
                      className={`text-[10px] font-medium ${
                        rating === i + 1
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-neutral-500"
                      }`}
                    >
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Color */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
                Mood color
              </label>
              <div className="flex gap-3">
                {moodOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setMood(color)}
                    className={`w-10 h-10 rounded-full ${moodColorClasses[color]} transition-all ${
                      mood === color
                        ? "ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-neutral-900 scale-110"
                        : "hover:scale-105"
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quick Thoughts */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                Quick thoughts (optional)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you love about this book?"
                className="w-full h-24 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleQuickPublish}
                disabled={loading || rating === 0}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Quick Publish
                  </>
                )}
              </button>
              <button
                onClick={handleFullReview}
                className="py-3 px-4 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                Full Editor
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
