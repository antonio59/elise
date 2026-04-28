import React, { useState } from "react";
import { Pencil } from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";
import ModalShell from "../../components/ModalShell";
import BookFormFields from "./BookFormFields";
import BookFormFooter from "./BookFormFooter";
import BookMetadataSection from "./BookMetadataSection";
import BookReviewSection from "./BookReviewSection";

type Book = Doc<"books">;

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

  return (
    <ModalShell
      isOpen={!!book}
      title="Edit Book"
      closeLabel="Close modal"
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <BookFormFields
          title={title}
          onTitleChange={setTitle}
          author={author}
          onAuthorChange={setAuthor}
          genre={genre}
          onGenreChange={setGenre}
          pageCount={pageCount}
          onPageCountChange={setPageCount}
        />

        <BookMetadataSection
          title={title}
          author={author}
          coverUrl={coverUrl}
          genre={genre}
          pageCount={pageCount}
          onTitleChange={setTitle}
          onAuthorChange={setAuthor}
          onCoverUrlChange={setCoverUrl}
          onGenreChange={setGenre}
          onPageCountChange={setPageCount}
        />

        <BookReviewSection
          status={status}
          review={review}
          onReviewChange={setReview}
          onGiphySelect={(value) => setReview((prev) => prev + value)}
          onJournalSelect={(text) =>
            setReview((prev) => (prev ? prev + "\n\n" + text : text))
          }
          moodTags={moodTags}
          onMoodTagsChange={setMoodTags}
          isFavorite={isFavorite}
          onFavoriteChange={setIsFavorite}
        />

        <BookFormFooter
          destination={status}
          onDestinationChange={setStatus}
          rating={rating}
          onRatingChange={setRating}
          saving={saving}
          canSubmit={!!title.trim() && !!author.trim()}
          submitLabel="Save Changes"
          submitIcon={<Pencil className="w-5 h-5" />}
          label="Status:"
        />
      </form>
    </ModalShell>
  );
};

export default EditBookModal;
