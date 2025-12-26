"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import ImageUpload from "@/components/ImageUpload";
import BookSearch from "@/components/BookSearch";
import EmojiPicker from "@/components/EmojiPicker";
import GiphyPicker from "@/components/GiphyPicker";
import StickerLibraryPicker from "@/components/StickerLibraryPicker";
import { BookResult, getPopularBooks } from "@/lib/bookSearch";
import { GENRES } from "@/lib/types";
import { Id } from "@/convex/_generated/dataModel";
import { Book, Sparkles, X, Gift } from "lucide-react";

type Props = {
  token: string | null;
  onComplete?: () => void;
};

const SUGGESTION_CATEGORIES = [
  { key: "young adult fantasy", label: "YA Fantasy" },
  { key: "manga", label: "Manga" },
  { key: "graphic novels", label: "Graphic Novels" },
  { key: "teen fiction", label: "Teen Fiction" },
  { key: "adventure", label: "Adventure" },
  { key: "romance", label: "Romance" },
];

export default function AddBookPanel({ token, onComplete }: Props) {
  const createBook = useMutation(api.books.create);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverStorageId, setCoverStorageId] = useState<Id<"_storage"> | null>(
    null,
  );
  const [genre, setGenre] = useState("");
  const [series, setSeries] = useState("");
  const [status, setStatus] = useState<"wishlist" | "reading" | "read">("read");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviewGifs, setReviewGifs] = useState<
    Array<{ id: string; url: string }>
  >([]);
  const [reviewStickers, setReviewStickers] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [pages, setPages] = useState("");
  const [published, setPublished] = useState(true);
  const [giftedBy, setGiftedBy] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Suggestions state
  const [suggestions, setSuggestions] = useState<BookResult[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState("young adult fantasy");

  useEffect(() => {
    loadSuggestions(activeCategory);
  }, [activeCategory]);

  const loadSuggestions = async (category: string) => {
    setLoadingSuggestions(true);
    const books = await getPopularBooks(category);
    setSuggestions(books);
    setLoadingSuggestions(false);
  };

  const handleSelect = (book: BookResult) => {
    setTitle(book.title);
    setAuthor(book.authors.join(", "));
    setCoverUrl(book.coverUrlLarge || book.coverUrl || null);
    setGenre(book.categories?.[0] || "");
    setPages(book.pageCount?.toString() || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !title || !author) return;
    setSaving(true);
    try {
      const reviewWithMedia =
        review +
        reviewStickers.map((s) => ` [sticker:${s.url}]`).join("") +
        reviewGifs.map((g) => ` [gif:${g.url}]`).join("");

      await createBook({
        token,
        title,
        author,
        coverUrl: coverUrl || undefined,
        coverStorageId: coverStorageId || undefined,
        genre: genre || undefined,
        series: series || undefined,
        status,
        rating,
        review: reviewWithMedia || undefined,
        published,
        pagesTotal: pages ? parseInt(pages) : undefined,
        giftedBy: giftedBy || undefined,
      });

      setTitle("");
      setAuthor("");
      setCoverUrl(null);
      setCoverStorageId(null);
      setGenre("");
      setSeries("");
      setStatus("read");
      setRating(5);
      setReview("");
      setReviewGifs([]);
      setReviewStickers([]);
      setPages("");
      setPublished(true);
      setGiftedBy("");
      setMessage("Book added!");
      onComplete?.();
    } catch (err: any) {
      setMessage(err.message || "Failed to add book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Add a New Book
      </h2>

      {/* Search Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-lg border border-gray-100 dark:border-neutral-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Google Books & Open Library
        </label>
        <BookSearch
          onSelect={handleSelect}
          placeholder="Search by title, author, or ISBN..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Search to auto-fill book details and cover from Google Books or Open
          Library
        </p>
      </div>

      {/* Suggestions Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-amber-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Suggestions
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTION_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                activeCategory === cat.key
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Suggestions Grid */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {loadingSuggestions ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-20 h-28 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"
              />
            ))
          ) : suggestions.length > 0 ? (
            suggestions.slice(0, 8).map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => handleSelect(book)}
                className="flex-shrink-0 group"
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all"
                  />
                ) : (
                  <div className="w-20 h-28 bg-gray-100 dark:bg-neutral-800 rounded flex items-center justify-center">
                    <Book size={20} className="text-gray-400" />
                  </div>
                )}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No suggestions available
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cover Display */}
        {coverUrl && !coverStorageId ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Book Cover
            </label>
            <div className="flex items-start gap-4">
              <img
                src={coverUrl}
                alt="Cover"
                className="w-24 h-36 object-cover rounded-lg shadow"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Cover loaded from search</p>
                <button
                  type="button"
                  onClick={() => setCoverUrl(null)}
                  className="text-red-500 hover:underline mt-1 flex items-center gap-1"
                >
                  <X size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ImageUpload
            token={token || ""}
            label="Upload Custom Cover"
            aspectRatio="portrait"
            currentImageUrl={null}
            onUploadComplete={(storageId, url) => {
              setCoverStorageId(storageId);
              setCoverUrl(url);
            }}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Magic Forest"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Author *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Elena Myst"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pages
            </label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 320"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Series
            </label>
            <input
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="e.g., One Piece"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Gift size={14} className="text-emerald-500" />
                Gifted By
              </span>
            </label>
            <input
              type="text"
              value={giftedBy}
              onChange={(e) => setGiftedBy(e.target.value)}
              placeholder="e.g., Grandma, Uncle Joe"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="book-published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 text-emerald-500 focus:ring-emerald-500"
          />
          <label
            htmlFor="book-published"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Share publicly
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <div className="flex gap-2">
            {[
              { value: "read", label: "Read", icon: "✓" },
              { value: "reading", label: "Reading", icon: "📖" },
              { value: "wishlist", label: "Want to Read", icon: "💫" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value as typeof status)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  status === option.value
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700"
                }`}
              >
                {option.icon} {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${
                  star <= rating
                    ? "text-amber-400"
                    : "text-gray-300 dark:text-neutral-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            My Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you think of this book?"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex items-center gap-1 mt-2">
            <EmojiPicker
              onSelect={(emoji) => setReview((prev) => prev + emoji)}
            />
            <GiphyPicker
              onSelect={(gif) => setReviewGifs((prev) => [...prev, gif])}
            />
            <StickerLibraryPicker
              onSelect={(sticker) =>
                setReviewStickers((prev) => [...prev, sticker])
              }
            />
          </div>
          {(reviewGifs.length > 0 || reviewStickers.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {reviewGifs.map((gif, i) => (
                <div key={i} className="relative">
                  <img src={gif.url} alt="" className="h-16 rounded" />
                  <button
                    type="button"
                    onClick={() =>
                      setReviewGifs((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {reviewStickers.map((s, i) => (
                <div key={i} className="relative">
                  <img
                    src={s.url}
                    alt={s.name}
                    className="h-12 w-12 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setReviewStickers((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !title || !author}
          className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Adding..." : "Add Book"}
        </button>
        {message && (
          <p
            className="text-sm text-center text-gray-600 dark:text-gray-400"
            role="status"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
