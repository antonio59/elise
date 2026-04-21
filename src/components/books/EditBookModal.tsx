import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  BookMarked,
  Heart,
  X,
  Loader2,
  Pencil,
  Star,
  Smile,
} from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";
import GoogleBookSearch from "../GoogleBookSearch";
import GiphyPicker from "../GiphyPicker";
import CoverUpload from "../CoverUpload";
import ReadingJournalHelper from "../ReadingJournalHelper";


type Book = Doc<"books">;

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

interface EditBookModalProps {
  book: Book | null;
  onClose: () => void;
  onSave: (updates: {
    title?: string;
    author?: string;
    coverUrl?: string;
    genre?: string;
    pageCount?: number;
    status?: "read" | "reading" | "wishlist";
    rating?: number;
    review?: string;
    isFavorite?: boolean;
    moodTags?: string[];
  }) => Promise<void>;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  book,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [genre, setGenre] = useState("Other");
  const [pageCount, setPageCount] = useState("");
  const [status, setStatus] = useState<"read" | "reading" | "wishlist">("read");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showEmojiGiphy, setShowEmojiGiphy] = useState(false);

  // Update form when book changes
  React.useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setCoverUrl(book.coverUrl || "");
      setGenre(book.genre || "Manga");
      setPageCount(book.pageCount?.toString() || "");
      setStatus(book.status);
      setRating(book.rating || 0);
      setReview(book.review || "");
      setIsFavorite(book.isFavorite);
      setMoodTags(book.moodTags || []);
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        author: author.trim(),
        coverUrl: coverUrl.trim() || undefined,
        genre: genre || undefined,
        pageCount: pageCount ? parseInt(pageCount) : undefined,
        status,
        rating: status === "read" && rating > 0 ? rating : undefined,
        review: review.trim() || undefined,
        isFavorite,
        moodTags: moodTags.length > 0 ? moodTags : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!book) return null;

  const destinations = [
    {
      key: "read" as const,
      label: "Finished",
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      key: "reading" as const,
      label: "Reading",
      icon: BookMarked,
      color: "bg-blue-500",
    },
    {
      key: "wishlist" as const,
      label: "Wishlist",
      icon: Heart,
      color: "bg-pink-500",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
              <h2 className="text-xl font-bold text-slate-800">Edit Book</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Book title"
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
                placeholder="Author name"
                required
              />
            </div>

            {/* Cover Art */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cover Art
              </label>
              <GoogleBookSearch
                onSelect={(book) => {
                  // Fill in missing metadata — keep Elise's personal data (rating, review, mood, fav)
                  if (!title.trim()) setTitle(book.title);
                  if (!author.trim()) setAuthor(book.author);
                  if (!coverUrl.trim()) setCoverUrl(book.coverUrl);
                  if (!genre || genre === "Other") setGenre(book.genre);
                  if (!pageCount && book.pageCount > 0) setPageCount(book.pageCount.toString());
                }}
              />
              <div className="mt-3">
                <CoverUpload value={coverUrl} onChange={setCoverUrl} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="input"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pages
                </label>
                <input
                  type="number"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  className="input"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {destinations.map((dest) => {
                  const Icon = dest.icon;
                  return (
                    <button
                      key={dest.key}
                      type="button"
                      onClick={() => setStatus(dest.key)}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                        status === dest.key
                          ? "border-primary-500 bg-primary-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${status === dest.key ? "text-primary-600" : "text-slate-400"}`}
                      />
                      <span
                        className={`text-sm font-medium ${status === dest.key ? "text-primary-600" : "text-slate-600"}`}
                      >
                        {dest.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating (only for finished books) */}
            {status === "read" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm font-medium text-primary-500 mt-2">
                    {["not it", "meh", "solid read", "obsessed", "all-time fav"][rating - 1]}
                  </p>
                )}
              </div>
            )}

            {/* Mood Tags */}
            {status === "read" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mood Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {["dark academia", "cottagecore", "main character energy", "slow burn", "found family", "enemies to lovers", "plot twist", "cozy vibes", "spicy", "soft", "wholesome", "gripping", "emotional damage", "healing", "magical", "realistic"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setMoodTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        moodTags.includes(tag)
                          ? "bg-primary-100 text-primary-700 border border-primary-300"
                          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Click to tag the vibes of this book
                </p>
              </div>
            )}

            {/* Review (only for finished books) */}
            {status === "read" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Review
                </label>
                <div className="relative">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full h-28 p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="What did you think about this book? Did it make you feel something?"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiGiphy(!showEmojiGiphy)}
                    className="absolute bottom-2 right-2 p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Emoji & GIF"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  {showEmojiGiphy && (
                    <GiphyPicker
                      onSelect={(value) => setReview((prev) => prev + value)}
                      onClose={() => setShowEmojiGiphy(false)}
                    />
                  )}
                </div>
                <ReadingJournalHelper onSelect={(text) => setReview((prev) => prev ? prev + "\n\n" + text : text)} />
              </div>
            )}

            {/* Favorite toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">Favorite</p>
                <p className="text-sm text-slate-500">
                  Mark this as one of your favorites
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  isFavorite ? "bg-pink-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isFavorite ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={saving || !title.trim() || !author.trim()}
              className="btn btn-primary w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditBookModal;
