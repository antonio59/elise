import CoverImage from "../components/CoverImage";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BookOpen,
  ChevronDown,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";

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

// Fix Google Books HTML-encoded URLs

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const ReviewsPage: React.FC = () => {
  const books = useQuery(api.books.getMyBooks) ?? [];
  const updateBook = useMutation(api.books.update);
  const [filter, setFilter] = useState<"all" | "favorites" | "5star" | "4star">("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "title">("recent");
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editReview, setEditReview] = useState("");
  const [saving, setSaving] = useState(false);

  // Books with reviews or ratings
  const reviewedBooks = books.filter(
    (b: Book) => b.rating && b.rating > 0
  );

  const filtered = reviewedBooks.filter((b: Book) => {
    switch (filter) {
      case "favorites":
        return b.isFavorite;
      case "5star":
        return b.rating === 5;
      case "4star":
        return b.rating === 4;
      default:
        return true;
    }
  });

  const sorted = [...filtered].sort((a: Book, b: Book) => {
    switch (sortBy) {
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0; // keep original order (recent)
    }
  });

  const stats = {
    total: reviewedBooks.length,
    fiveStars: reviewedBooks.filter((b: Book) => b.rating === 5).length,
    fourStars: reviewedBooks.filter((b: Book) => b.rating === 4).length,
    favorites: reviewedBooks.filter((b: Book) => b.isFavorite).length,
    withReviews: reviewedBooks.filter((b: Book) => b.review && b.review.length > 0).length,
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Book Reviews
          </h1>
          <p className="text-slate-500">
            Every book Elise has rated and reviewed
          </p>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-xs text-slate-500">Rated</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-yellow-500">{stats.fiveStars}</div>
              <div className="text-xs text-slate-500">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-primary-500">{stats.fourStars}</div>
              <div className="text-xs text-slate-500">⭐⭐⭐⭐</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-red-400">{stats.favorites}</div>
              <div className="text-xs text-slate-500">Favorites</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold text-slate-600">{stats.withReviews}</div>
              <div className="text-xs text-slate-500">With Reviews</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All", icon: BookOpen },
            { key: "favorites", label: "Favorites", icon: Heart },
            { key: "5star", label: "5-Star", icon: Star },
            { key: "4star", label: "4-Star", icon: Star },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-primary-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}

          <div className="flex-1" />

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1.5 pr-7 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
            >
              <option value="recent">Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="title">A–Z</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Empty State */}
        {sorted.length === 0 && (
          <div className="card p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No reviews yet
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Add ratings and reviews to your books in the Dashboard to see them here.
            </p>
            <Link to="/dashboard/books" className="btn btn-primary text-sm">
              <BookOpen className="w-4 h-4" />
              Go to My Books
            </Link>
          </div>
        )}

        {/* Review Cards — Flip Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((book: Book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.3) }}
              className="cursor-pointer"
              onClick={() => setFlippedId(flippedId === book._id ? null : book._id)}
            >
              <AnimatePresence mode="wait">
                {flippedId !== book._id ? (
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
                        <CoverImage book={book} className="w-full h-full object-cover" />
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
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-slate-400 ml-1">
                            {RATING_LABELS[book.rating ?? 0]}
                          </span>
                        </div>
                        {book.isFavorite && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-400 font-medium">
                            <Heart className="w-3 h-3 fill-red-400" />
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
                ) : editingId === book._id ? (
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
                        onClick={() => setEditingId(null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        cancel
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      <label className="text-xs text-slate-500 mb-1 block">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditRating(star)}
                            className="p-0.5"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                star <= editRating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-slate-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review */}
                    <div className="mb-3">
                      <label className="text-xs text-slate-500 mb-1 block">Review</label>
                      <textarea
                        value={editReview}
                        onChange={(e) => setEditReview(e.target.value)}
                        className="w-full h-20 p-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Write your review..."
                      />
                    </div>

                    {/* Save */}
                    <button
                      onClick={async () => {
                        setSaving(true);
                        try {
                          await updateBook({
                            id: book._id as Id<"books">,
                            rating: editRating > 0 ? editRating : undefined,
                            review: editReview.trim() || undefined,
                          });
                          setEditingId(null);
                        } finally {
                          setSaving(false);
                        }
                      }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(book._id);
                            setEditRating(book.rating || 0);
                            setEditReview(book.review || "");
                          }}
                          className="text-xs text-primary-500 hover:text-primary-700"
                        >
                          edit
                        </button>
                        <span className="text-xs text-slate-400">tap to flip</span>
                      </div>
                    </div>
                    {book.review ? (
                      <blockquote className="text-slate-600 text-sm leading-relaxed border-l-3 border-primary-300 pl-4">
                        "{book.review}"
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
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      {book.author && (
                        <span>by {book.author}</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
