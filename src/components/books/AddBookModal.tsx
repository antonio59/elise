import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import GoogleBookSearch from "../GoogleBookSearch";
import CoverImage from "../CoverImage";
import CoverUpload from "../CoverUpload";
import BookFormFooter from "./BookFormFooter";

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
      resetForm();
      handleClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

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
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  const handleClearDuplicate = () => setDuplicateInfo(null);

  const canSubmit = title.trim() && author.trim();

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
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-book-title"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 id="add-book-title" className="text-xl font-bold text-slate-800">Add Book</h2>
              <button
                onClick={handleClose}
                aria-label="Close modal"
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
                    <CoverImage book={{ coverUrl, title, author }} className="w-full h-full object-cover" />
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

                <BookFormFooter
                  destination={destination}
                  onDestinationChange={setDestination}
                  rating={rating}
                  onRatingChange={setRating}
                  error={error}
                  duplicateInfo={duplicateInfo}
                  onMoveBook={handleMoveBook}
                  onClearDuplicate={handleClearDuplicate}
                  saving={saving}
                  canSubmit={!!canSubmit}
                  getStatusLabel={getStatusLabel}
                />

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
                      className="bg-slate-50 px-2 text-slate-400 uppercase tracking-wider hover:text-slate-600"
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

                    <BookFormFooter
                      destination={destination}
                      onDestinationChange={setDestination}
                      rating={rating}
                      onRatingChange={setRating}
                      error={error}
                      duplicateInfo={duplicateInfo}
                      onMoveBook={handleMoveBook}
                      onClearDuplicate={handleClearDuplicate}
                      saving={saving}
                      canSubmit={!!canSubmit}
                      getStatusLabel={getStatusLabel}
                    />
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

export default AddBookModal;
