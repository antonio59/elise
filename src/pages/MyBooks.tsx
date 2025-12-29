import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  BookMarked,
  Heart,
  Star,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id, Doc } from "../../convex/_generated/dataModel";

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

  const [activeTab, setActiveTab] = useState<TabType>("read");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
                  ? "bg-gradient-to-r from-primary-500 to-violet-500 text-white shadow-sm"
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
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-violet-100">
                  <BookOpen className="w-8 h-8 text-primary-400" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    removeBook({ id: book._id });
                  }}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
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
          await addBook({
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            genre: book.genre,
            pageCount: book.pageCount,
            status: destination,
            rating: destination === "read" ? book.rating : undefined,
            isFavorite: false,
          });
          setShowAddModal(false);
        }}
      />
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
      genre: string;
      pageCount?: number;
      description?: string;
      ageRating: string;
      rating?: number;
    },
    destination: "read" | "reading" | "wishlist",
  ) => Promise<void>;
}

const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [genre, setGenre] = useState("Manga");
  const [pageCount, setPageCount] = useState("");
  const [rating, setRating] = useState(0);
  const [destination, setDestination] = useState<
    "read" | "reading" | "wishlist"
  >("read");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setSaving(true);
    try {
      await onAdd(
        {
          title: title.trim(),
          author: author.trim(),
          coverUrl: coverUrl.trim() || undefined,
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
              <h2 className="text-xl font-bold text-slate-800">Add Book</h2>
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cover URL
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="input"
                placeholder="https://..."
              />
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

            {/* Rating (only for finished books) */}
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

            <button
              type="submit"
              disabled={saving || !title.trim() || !author.trim()}
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
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MyBooks;
