import React from "react";
import { Link } from "react-router-dom";
import { X, Star, ArrowRight } from "lucide-react";
import CoverImage from "../CoverImage";
import StarRating from "../StarRating";

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

export type PeekBook = {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
  rating?: number;
  review?: string;
};

interface BookPeekModalProps {
  book: PeekBook | null;
  onClose: () => void;
}

const BookPeekModal: React.FC<BookPeekModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  const hasReview = Boolean(book.review && book.review.length > 0);
  const preview = hasReview
    ? book.review!.length > 180
      ? `${book.review!.slice(0, 180)}…`
      : book.review!
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        aria-label="Close peek"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="peek-title"
        className="relative w-full max-w-md bg-slate-50 rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-slate-800 min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4 p-5 pt-6">
          <div className="w-24 flex-shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-md">
            <CoverImage book={book} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1 pr-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
              Elise&apos;s take
            </p>
            <h2
              id="peek-title"
              className="font-display text-xl font-bold text-slate-900 leading-snug"
            >
              {book.title}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{book.author}</p>
            {book.rating && book.rating > 0 && (
              <div className="mt-3">
                <StarRating
                  rating={book.rating}
                  size="sm"
                  showLabel
                  labels={RATING_LABELS}
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-5">
          {preview ? (
            <blockquote className="text-sm text-slate-600 leading-relaxed border-l-2 border-primary-300 pl-3 italic mb-4">
              &ldquo;{preview}&rdquo;
            </blockquote>
          ) : (
            <p className="text-sm text-slate-500 italic mb-4 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-star fill-star" />
              Rated, no written review yet
            </p>
          )}

          <div className="flex gap-2">
            <Link
              to={`/reviews/${book._id}`}
              onClick={onClose}
              className="btn btn-primary flex-1 min-h-11"
            >
              Full review
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/books/${book._id}`}
              onClick={onClose}
              className="btn btn-secondary min-h-11"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPeekModal;
