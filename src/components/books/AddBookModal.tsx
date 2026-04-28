import React, { useState } from "react";
import { useMutation } from "convex/react";
import ModalShell from "../ModalShell";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import GoogleBookSearch from "../GoogleBookSearch";
import CoverImage from "../CoverImage";
import CoverUpload from "../CoverUpload";
import BookFormFooter from "./BookFormFooter";
import BookFormFields from "./BookFormFields";



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
    <ModalShell
      isOpen={isOpen}
      title="Add Book"
      closeLabel="Close modal"
      onClose={handleClose}
      maxWidth="max-w-lg"
      titleId="add-book-title"
    >
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
                    <BookFormFields
                      title={title}
                      onTitleChange={setTitle}
                      author={author}
                      onAuthorChange={setAuthor}
                      genre={genre}
                      onGenreChange={setGenre}
                      pageCount={pageCount}
                      onPageCountChange={setPageCount}
                      showRequired
                    />
                    <CoverUpload value={coverUrl} onChange={setCoverUrl} />

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
    </ModalShell>
  );
};

export default AddBookModal;
