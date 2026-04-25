import React, { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
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
  Pencil,
  Smile,
} from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import CoverImage from "../components/CoverImage";
import GiphyPicker from "../components/GiphyPicker";
import { Button } from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/Modal";
import { BookGridSkeleton } from "../components/Skeleton";
import AddBookModal from "../components/books/AddBookModal";
import EditBookModal from "../components/books/EditBookModal";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

type TabType = "read" | "reading" | "wishlist";

type Book = Doc<"books">;

const MyBooks: React.FC = () => {
  usePageAnnouncement("My Books");
  usePageMeta({ title: "My Books", description: "Manage your books" });
  // Get all books - the query handles auth internally
  const booksRaw = useQuery(api.books.getMyBooks);
  const books = useMemo(() => booksRaw ?? [], [booksRaw]);

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Id<"books"> | null>(null);

  // Filter by status instead of isRead — must be before any early return
  const readBooks = useMemo(() => books.filter((b: Book) => b.status === "read"), [books]);
  const readingBooks = useMemo(() => books.filter((b: Book) => b.status === "reading"), [books]);
  const wishlistBooks = useMemo(() => books.filter((b: Book) => b.status === "wishlist"), [books]);

  const filteredBooks = useMemo(() => {
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
  }, [activeTab, readBooks, readingBooks, wishlistBooks, searchQuery]);

  if (booksRaw === undefined) return <BookGridSkeleton />;

  const tabs = [
    {
      key: "read" as TabType,
      label: "Finished",
      icon: CheckCircle2,
      count: readBooks.length,
      color: "text-success-600",
    },
    {
      key: "reading" as TabType,
      label: "Reading",
      icon: BookMarked,
      count: readingBooks.length,
      color: "text-accent-600",
    },
    {
      key: "wishlist" as TabType,
      label: "Wishlist",
      icon: Heart,
      count: wishlistBooks.length,
      color: "text-primary-600",
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
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Book
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-fit">
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBooks.map((book: Book, index: number) => (
          <motion.div
            key={book._id}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
              <CoverImage book={book} className="w-full h-full object-cover" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setEditingBook(book)}
                  className="p-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg"
                  title="Edit book"
                  aria-label="Edit book"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setBookToDelete(book._id);
                    setShowDeleteConfirm(true);
                  }}
                  className="p-2 bg-error-500 hover:bg-error-600 text-white rounded-lg"
                  title="Delete book"
                  aria-label="Delete book"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Rating badge */}
              {book.rating && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1 bg-slate-900/50 rounded-full">
                  <Star className="w-3 h-3 text-star fill-star" />
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

        {filteredBooks.length === 0 && (
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
          // If added as "read", celebrate and prompt to write a review
          if (destination === "read") {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"],
            });
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setBookToDelete(null);
        }}
        onConfirm={() => {
          if (bookToDelete) {
            removeBook({ id: bookToDelete });
          }
          setShowDeleteConfirm(false);
          setBookToDelete(null);
        }}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Write Review Popup */}
      <AnimatePresence>
        {showEditReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowEditReview(false)}
            />
            <motion.div
              className="relative bg-slate-50 rounded-2xl shadow-xl max-w-md w-full p-6"
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
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowEditReview(false);
                    setReviewBookId(null);
                    setReviewText("");
                  }}
                >
                  Skip
                </Button>
                <Button
                  className="flex-1"
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
                  disabled={!reviewText.trim()}
                >
                  Save Review
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBooks;
