import React, { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Smile } from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import GiphyPicker from "../components/GiphyPicker";
import { Button } from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/Modal";
import { BookGridSkeleton } from "../components/Skeleton";
import AddBookModal from "../components/books/AddBookModal";
import EditBookModal from "../components/books/EditBookModal";
import BookFilterBar from "../components/books/BookFilterBar";
import BookGrid from "../components/books/BookGrid";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

type TabType = "read" | "reading" | "wishlist";
type Book = Doc<"books">;

const MyBooks: React.FC = () => {
  usePageAnnouncement("My Books");
  usePageMeta({ title: "My Books", description: "Manage your books" });
  const booksRaw = useQuery(api.books.getMyBooks);
  const books = useMemo(() => booksRaw ?? [], [booksRaw]);

  const addBook = useMutation(api.books.add);
  const updateBook = useMutation(api.books.update);
  const removeBook = useMutation(api.books.remove);
  const storeCover = useAction(api.covers.storeFromUrl);
  const storeAllCovers = useAction(api.covers.storeAll);

  const coverSyncRan = useRef(false);
  useEffect(() => {
    if (coverSyncRan.current || books.length === 0) return;
    const needsSync = books.some((b: Book) => b.coverUrl && !b.coverStorageId);
    if (!needsSync) return;
    coverSyncRan.current = true;
    storeAllCovers({}).catch(() => {});
  }, [books, storeAllCovers]);

  const [activeTab, setActiveTab] = useState<TabType>("read");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditReview, setShowEditReview] = useState(false);
  const [showReviewEmoji, setShowReviewEmoji] = useState(false);
  const [reviewBookId, setReviewBookId] = useState<Id<"books"> | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Id<"books"> | null>(null);

  const readBooks = useMemo(
    () => books.filter((b: Book) => b.status === "read"),
    [books],
  );
  const readingBooks = useMemo(
    () => books.filter((b: Book) => b.status === "reading"),
    [books],
  );
  const wishlistBooks = useMemo(
    () => books.filter((b: Book) => b.status === "wishlist"),
    [books],
  );

  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const list =
      activeTab === "read"
        ? readBooks
        : activeTab === "reading"
          ? readingBooks
          : wishlistBooks;
    return list.filter(
      (b: Book) =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query),
    );
  }, [activeTab, readBooks, readingBooks, wishlistBooks, searchQuery]);

  if (booksRaw === undefined) return <BookGridSkeleton />;

  return (
    <div className="space-y-6">
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

      <BookFilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          read: readBooks.length,
          reading: readingBooks.length,
          wishlist: wishlistBooks.length,
        }}
      />

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

      <BookGrid
        books={filteredBooks}
        searchQuery={searchQuery}
        activeTab={activeTab}
        onEdit={setEditingBook}
        onDelete={(id) => {
          setBookToDelete(id);
          setShowDeleteConfirm(true);
        }}
      />

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
          storeCover({ bookId }).catch(() => {});
          setShowAddModal(false);
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

      <EditBookModal
        book={editingBook}
        onClose={() => setEditingBook(null)}
        onSave={async (updates) => {
          if (!editingBook) return;
          await updateBook({ id: editingBook._id, ...updates });
          setEditingBook(null);
        }}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setBookToDelete(null);
        }}
        onConfirm={() => {
          if (bookToDelete) removeBook({ id: bookToDelete });
          setShowDeleteConfirm(false);
          setBookToDelete(null);
        }}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

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
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Write a Review ✨
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Share your thoughts about this book
              </p>
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
