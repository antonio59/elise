import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart } from "lucide-react";
import CoverImage from "../CoverImage";
import type { Id } from "../../../convex/_generated/dataModel";

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

interface Book {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
  genre?: string;
  rating?: number;
  review?: string;
  isFavorite?: boolean;
  pageCount?: number;
  status: string;
  moodTags?: string[];
}

interface ReviewCardProps {
  book: Book;
  index: number;
  onSave: (
    bookId: Id<"books">,
    rating: number | undefined,
    review: string | undefined,
  ) => Promise<void>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ book, index, onSave }) => {
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editReview, setEditReview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
    setEditRating(book.rating || 0);
    setEditReview(book.review || "");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(
        book._id as Id<"books">,
        editRating > 0 ? editRating : undefined,
        editReview.trim() || undefined,
      );
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
    >
      <AnimatePresence mode="wait">
        {!flipped ? (
          /* Front: Cover + Rating */
          <motion.div
            key="front"
            className="card p-4 hover:shadow-lg transition-shadow"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-4">
              <div className="w-20 h-28 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <CoverImage
                  book={book}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (book.rating ?? 0)
                          ? "text-star fill-star"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">
                    {RATING_LABELS[book.rating ?? 0]}
                  </span>
                </div>
                {book.isFavorite && (
                  <span className="inline-flex items-center gap-1 text-xs text-error-400 font-medium">
                    <Heart className="w-3 h-3 fill-error-400" />
                    Favorite
                  </span>
                )}
                {book.review && (
                  <p className="text-xs text-primary-500 mt-2 font-medium">
                    Tap to see review →
                  </p>
                )}
                {book.genre && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500">
                    {book.genre}
                  </span>
                )}
                {book.moodTags && book.moodTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.moodTags.map((tag) => (
                      <span key={tag} className="mood-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : editing ? (
          /* Back: Edit Mode */
          <motion.div
            key="edit"
            className="card p-5 bg-gradient-to-br from-amber-50 to-white min-h-[200px]"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-slate-800">{book.title}</h3>
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                cancel
              </button>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <label className="text-xs text-slate-500 mb-1 block">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setEditRating(star)}
                    className="p-0.5"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= editRating
                          ? "text-star fill-star"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review */}
            <div className="mb-3">
              <label className="text-xs text-slate-500 mb-1 block">
                Review
              </label>
              <textarea
                value={editReview}
                onChange={(e) => setEditReview(e.target.value)}
                className="w-full h-20 p-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Write your review..."
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary text-sm w-full"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        ) : (
          /* Back: Full Review */
          <motion.div
            key="back"
            className="card p-5 bg-gradient-to-br from-primary-50 to-white min-h-[200px]"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-slate-800">{book.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="text-xs text-primary-500 hover:text-primary-700"
                >
                  edit
                </button>
                <span className="text-xs text-slate-400">tap to flip</span>
              </div>
            </div>
            {book.review ? (
              <blockquote className="text-slate-600 text-sm leading-relaxed border-l-3 border-primary-300 pl-4">
                &ldquo;{book.review}&rdquo;
              </blockquote>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No written review — just a rating.
              </p>
            )}
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < (book.rating ?? 0)
                        ? "text-star fill-star"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              {book.author && <span>by {book.author}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReviewCard;
