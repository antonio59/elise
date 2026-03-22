import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  BookMarked,
  Heart,
  Star,
  Trash2,
  X,
  Loader2,
  Pencil,
  AlertCircle,
  Smile,
} from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import GoogleBookSearch from "../components/GoogleBookSearch";
import GiphyPicker from "../components/GiphyPicker";
import CoverUpload from "../components/CoverUpload";
import CoverImage from "../components/CoverImage";

type TabType = "read" | "reading" | "wishlist";

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

const MyBooks: React.FC = () => {
  // Get all books - the query handles auth internally
  const books = useQuery(api.books.getMyBooks) ?? [];

  const addBook = useMutation(api.books.add);
  const updateBook = useMutation(api.books.update);
  const removeBook = useMutation(api.books.remove);
  const storeCover = useAction(api.covers.storeFromUrl);
  const storeAllCovers = useAction(api.covers.storeAll);

  // Once per session: kick off cover storage for any book that has a coverUrl
  // but no permanent coverStorageId (e.g. existing books with expired Google URLs).
  const coverSyncRan = useRef(false);
  useEffect(() => {
    if (coverSyncRan.current || books.length === 0) return;
    const needsSync = books.some((b: Book) => b.coverUrl && !b.coverStorageId);
    if (!needsSync) return;
    coverSyncRan.current = true;
    storeAllCovers({}).catch(() => {});
  }, [books, storeAllCovers]);

  const [activeTab, setActiveTab] = useState<"read" | "reading" | "wishlist">("read");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditReview, setShowEditReview] = useState(false);
  const [showReviewEmoji, setShowReviewEmoji] = useState(false);
  const [reviewBookId, setReviewBookId] = useState<Id<"books"> | null>(null);
  const [reviewText, setReviewText] = useState("");

  // Filter by status instead of isRead
  const readBooks = books.filter((b: Book) => b.status === "read");
  const readingBooks = books.filter((b: Book) => b.status === "reading");
  const wishlistBooks = books.filter((b: Book) => b.status === "wishlist");

  const filteredBooks = (): Book[] => {
    const query = searchQuery.toLowerCase();
    switch (activeTab) {
      case "read":
        return readBooks.filter(
          (b: Book) =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query),
        );
      case "reading":
        return readingBooks.filter(
          (b: Book) =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query),
        );
      case "wishlist":
        return wishlistBooks.filter(
          (b: Book) =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query),
        );
    }
  };

  const tabs = [
    {
      key: "read" as TabType,
      label: "Finished",
      icon: CheckCircle2,
      count: readBooks.length,
      color: "text-green-600",
    },
    {
      key: "reading" as TabType,
      label: "Reading",
      icon: BookMarked,
      count: readingBooks.length,
      color: "text-blue-600",
    },
    {
      key: "wishlist" as TabType,
      label: "Wishlist",
      icon: Heart,
      count: wishlistBooks.length,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Books</h1>
          <p className="text-slate-500 mt-1">Track your reading adventures</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Book
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${activeTab === tab.key ? "" : tab.color}`}
              />
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20" : "bg-slate-100"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books..."
          className="input pl-10"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredBooks().map((book: Book, index: number) => (
          <motion.div
            key={book._id}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
              <CoverImage book={book} />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setEditingBook(book)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  title="Edit book"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this book?")) {
                      removeBook({ id: book._id });
                    }
                  }}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  title="Delete book"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Rating badge */}
              {book.rating && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1 bg-black/50 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-medium">
                    {book.rating}
                  </span>
                </div>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
            {book.genre && book.genre !== "Other" && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">{book.genre}</span>
            )}
          </motion.div>
        ))}

        {filteredBooks().length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              {searchQuery
                ? "No books match your search"
                : `No books in ${activeTab} yet`}
            </p>
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async (book, destination) => {
          const bookId = await addBook({
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            isbn: book.isbn,
            genre: book.genre,
            pageCount: book.pageCount,
            status: destination,
            rating: destination === "read" ? book.rating : undefined,
            isFavorite: false,
          });
          // Fire-and-forget: permanently store the cover in Convex storage
          storeCover({ bookId }).catch(() => {});
          setShowAddModal(false);
          // If added as "read", prompt to write a review
          if (destination === "read") {
            setReviewBookId(bookId);
            setReviewText("");
            setShowEditReview(true);
          }
        }}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        book={editingBook}
        onClose={() => setEditingBook(null)}
        onSave={async (updates) => {
          if (!editingBook) return;
          await updateBook({
            id: editingBook._id,
            ...updates,
          });
          setEditingBook(null);
        }}
      />

      {/* Write Review Popup */}
      <AnimatePresence>
        {showEditReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowEditReview(false)}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2 className="text-xl font-bold text-slate-800 mb-2">Write a Review ✨</h2>
              <p className="text-sm text-slate-500 mb-4">Share your thoughts about this book</p>
              <div className="relative">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full h-32 p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="What did you think? Did it make you feel something? Would you recommend it?"
                />
                <button
                  type="button"
                  onClick={() => setShowReviewEmoji(!showReviewEmoji)}
                  className="absolute bottom-2 right-2 p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Emoji & GIF"
                >
                  <Smile className="w-4 h-4" />
                </button>
                {showReviewEmoji && (
                  <GiphyPicker
                    onSelect={(value) => setReviewText((prev) => prev + value)}
                    onClose={() => setShowReviewEmoji(false)}
                  />
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowEditReview(false);
                    setReviewBookId(null);
                    setReviewText("");
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Skip
                </button>
                <button
                  onClick={async () => {
                    if (reviewBookId && reviewText.trim()) {
                      await updateBook({
                        id: reviewBookId,
                        review: reviewText.trim(),
                      });
                    }
                    setShowEditReview(false);
                    setReviewBookId(null);
                    setReviewText("");
                  }}
                  className="btn btn-primary flex-1"
                  disabled={!reviewText.trim()}
                >
                  Save Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add Book Modal Component
interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    book: {
      title: string;
      author: string;
      coverUrl?: string;
      isbn?: string;
      genre: string;
      pageCount?: number;
      description?: string;
      ageRating: string;
      rating?: number;
    },
    destination: "read" | "reading" | "wishlist",
  ) => Promise<void>;
}

// Edit Book Modal Component
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

const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const updateBook = useMutation(api.books.update);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isbn, setIsbn] = useState<string | undefined>(undefined);
  const [genre, setGenre] = useState("Manga");
  const [pageCount, setPageCount] = useState("");
  const [rating, setRating] = useState(0);
  const [destination, setDestination] = useState<
    "read" | "reading" | "wishlist"
  >("read");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<{
    id: Id<"books">;
    currentStatus: string;
  } | null>(null);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCoverUrl("");
    setIsbn(undefined);
    setGenre("Manga");
    setPageCount("");
    setRating(0);
    setDestination("read");
    setError(null);
    setManualMode(false);
    setDuplicateInfo(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "read":
        return "finished";
      case "reading":
        return "currently reading";
      case "wishlist":
        return "on your wishlist";
      default:
        return status;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setSaving(true);
    setError(null);
    setDuplicateInfo(null);
    try {
      await onAdd(
        {
          title: title.trim(),
          author: author.trim(),
          coverUrl: coverUrl.trim() || undefined,
          isbn,
          genre,
          pageCount: pageCount ? parseInt(pageCount) : undefined,
          ageRating: "All Ages",
          rating: destination === "read" && rating > 0 ? rating : undefined,
        },
        destination,
      );
      // Reset form
      setTitle("");
      setAuthor("");
      setCoverUrl("");
      setGenre("Manga");
      setPageCount("");
      setRating(0);
      setDestination("read");
      handleClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      // Check if it's a duplicate error with move option
      if (message.startsWith("DUPLICATE:")) {
        const parts = message.split(":");
        const bookId = parts[1];
        const currentStatus = parts[2];
        setDuplicateInfo({ id: bookId as Id<"books">, currentStatus });
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleMoveBook = async () => {
    if (!duplicateInfo) return;

    setSaving(true);
    try {
      await updateBook({
        id: duplicateInfo.id,
        status: destination,
        rating: destination === "read" && rating > 0 ? rating : undefined,
      });
      // Reset and close
      setTitle("");
      setAuthor("");
      setCoverUrl("");
      setGenre("Manga");
      setPageCount("");
      setRating(0);
      setDestination("read");
      setDuplicateInfo(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

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
              <h2 className="text-xl font-bold text-slate-800">Add Book</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {title && !manualMode ? (
              /* === Book Selected View === */
              <>
                {/* Book Preview Card */}
                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-16 h-24 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                    {coverUrl ? (
                      <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 line-clamp-2">{title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{author}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">{genre}</span>
                      {pageCount && <span className="text-xs text-slate-400">{pageCount} pages</span>}
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Where does this go?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {destinations.map((dest) => {
                      const Icon = dest.icon;
                      return (
                        <button
                          key={dest.key}
                          type="button"
                          onClick={() => setDestination(dest.key)}
                          className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                            destination === dest.key
                              ? "border-primary-500 bg-primary-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${destination === dest.key ? "text-primary-600" : "text-slate-400"}`}
                          />
                          <span
                            className={`text-sm font-medium ${destination === dest.key ? "text-primary-600" : "text-slate-600"}`}
                          >
                            {dest.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating (only for finished) */}
                {destination === "read" && (
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
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Duplicate found */}
                {duplicateInfo && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-amber-800 font-medium">
                          This book is {getStatusLabel(duplicateInfo.currentStatus)}
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          Would you like to move it to {getStatusLabel(destination)}{" "}
                          instead?
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={handleMoveBook}
                            disabled={saving}
                            className="btn btn-primary text-sm py-2"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>Yes, move it</>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDuplicateInfo(null)}
                            className="btn btn-secondary text-sm py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving || !title.trim() || !author.trim() || !!duplicateInfo}
                  className="btn btn-primary w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Book
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Not the right book?{" "}
                  <button
                    type="button"
                    onClick={() => { setTitle(""); setAuthor(""); setCoverUrl(""); setIsbn(undefined); setGenre("Other"); setPageCount(""); setManualMode(true); }}
                    className="text-primary-500 hover:underline"
                  >
                    Clear &amp; add manually
                  </button>
                </p>
              </>
            ) : (
              /* === Search + Manual Entry View === */
              <>
                <GoogleBookSearch
                  onSelect={(book) => {
                    setTitle(book.title);
                    setAuthor(book.author);
                    setCoverUrl(book.coverUrl);
                    setIsbn(book.isbn);
                    setGenre(book.genre);
                    if (book.pageCount > 0) setPageCount(book.pageCount.toString());
                    setManualMode(false);
                  }}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <button
                      type="button"
                      onClick={() => setManualMode(!manualMode)}
                      className="bg-white px-2 text-slate-400 uppercase tracking-wider hover:text-slate-600"
                    >
                      {manualMode ? "back to search" : "can't find your book? add manually"}
                    </button>
                  </div>
                </div>

                {manualMode && (
                  <>
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

                    <CoverUpload value={coverUrl} onChange={setCoverUrl} />

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

                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Add to:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {destinations.map((dest) => {
                          const Icon = dest.icon;
                          return (
                            <button
                              key={dest.key}
                              type="button"
                              onClick={() => setDestination(dest.key)}
                              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                                destination === dest.key
                                  ? "border-primary-500 bg-primary-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <Icon
                                className={`w-5 h-5 ${destination === dest.key ? "text-primary-600" : "text-slate-400"}`}
                              />
                              <span
                                className={`text-sm font-medium ${destination === dest.key ? "text-primary-600" : "text-slate-600"}`}
                              >
                                {dest.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rating (only for finished) */}
                    {destination === "read" && (
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
                      </div>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {/* Duplicate found */}
                    {duplicateInfo && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-amber-800 font-medium">
                              This book is {getStatusLabel(duplicateInfo.currentStatus)}
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                              Would you like to move it to {getStatusLabel(destination)}{" "}
                              instead?
                            </p>
                            <div className="flex gap-2 mt-3">
                              <button
                                type="button"
                                onClick={handleMoveBook}
                                disabled={saving}
                                className="btn btn-primary text-sm py-2"
                              >
                                {saving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>Yes, move it</>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDuplicateInfo(null)}
                                className="btn btn-secondary text-sm py-2"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={saving || !title.trim() || !author.trim() || !!duplicateInfo}
                      className="btn btn-primary w-full"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Add Book
                        </>
                      )}
                    </button>
                  </>
                )}
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MyBooks;
