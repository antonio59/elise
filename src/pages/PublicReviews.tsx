import CoverImage from "../components/CoverImage";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, MessageCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import ReactionBar from "../components/ReactionBar";

interface Book {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  rating?: number;
  review?: string;
  moodTags?: string[];
}

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const PublicReviews: React.FC = () => {
  const books = useQuery(api.books.getReadBooks) ?? [];
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const reviewedBooks = books.filter(
    (b: Book) => (b.rating && b.rating > 0) || (b.review && b.review.length > 0)
  );

  const filteredBooks = reviewedBooks.filter((b) => {
    if (!ratingFilter) return true;
    return b.rating === ratingFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">Book Reviews</span>
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">What I Thought...</span>
        </h1>
        <p className="text-slate-500 mt-1">honest thoughts on books I've read</p>
      </div>

      {/* Rating Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setRatingFilter(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !ratingFilter ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All ({reviewedBooks.length})
        </button>
        {[5, 4, 3, 2, 1].map((r) => {
          const count = reviewedBooks.filter((b) => b.rating === r).length;
          if (count === 0) return null;
          return (
            <button
              key={r}
              onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                ratingFilter === r ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {Array.from({ length: r }).map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-0.5">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-violet-50 to-primary-50 rounded-2xl">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-slate-600 font-medium">
            {ratingFilter ? `No ${ratingFilter}-star reviews yet` : "No reviews yet"}
          </p>
          {ratingFilter && (
            <button onClick={() => setRatingFilter(null)} className="text-sm text-primary-500 mt-2 underline">
              Show all
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Mobile: show everything. Desktop: flip card */}
              <div className="md:hidden">
                <div className="card overflow-hidden">
                  <div className="flex">
                    {/* Cover */}
                    <div className="w-24 flex-shrink-0 bg-slate-100">
<CoverImage book={book} className="w-full h-full object-cover" />
                    </div>
                    {/* Info */}
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-slate-800 line-clamp-1">{book.title}</h3>
                      <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < (book.rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
                        ))}
                        {book.rating && book.rating > 0 && (
                          <span className="ml-1 text-xs text-primary-500 font-medium">{RATING_LABELS[book.rating]}</span>
                        )}
                      </div>
                      {book.genre && book.genre !== "Other" && (
                        <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-200">{book.genre}</span>
                      )}
                    </div>
                  </div>
                  {/* Review text — always visible on mobile */}
                  <div className="px-4 pb-3">
                    {book.review ? (
                      <blockquote className="text-slate-600 text-sm leading-relaxed border-l-2 border-primary-300 pl-3">
                        "{book.review}"
                      </blockquote>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No written review — just a rating.</p>
                    )}
                    {book.moodTags && book.moodTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.moodTags.map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <ReactionBar targetType="book" targetId={book._id} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: flip card */}
              <div className="hidden md:block cursor-pointer" onClick={() => setFlippedId(flippedId === book._id ? null : book._id)}>
                <AnimatePresence mode="wait">
                  {flippedId !== book._id ? (
                    /* Front: Editorial Card */
                    <motion.div
                      key="front"
                      className="card overflow-hidden flex h-[180px] hover:shadow-lg transition-shadow"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-28 flex-shrink-0 bg-slate-100">
  <CoverImage book={book} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{book.title}</h3>
                          <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < (book.rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
                            ))}
                            {book.rating && book.rating > 0 && (
                              <span className="ml-2 text-xs text-primary-500 font-medium">{RATING_LABELS[book.rating]}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          {book.genre && book.genre !== "Other" && (
                            <span className="text-[10px] px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-200">{book.genre}</span>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            tap for review
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Back: Full Review */
                    <motion.div
                      key="back"
                      className="card p-6 bg-gradient-to-br from-violet-50 to-white h-[180px] flex flex-col"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800">{book.title}</h3>
                          <p className="text-xs text-slate-400">by {book.author}</p>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">tap to flip</span>
                      </div>
                      {book.review ? (
                        <blockquote className="text-slate-600 text-sm leading-relaxed border-l-3 border-primary-300 pl-4 flex-1 line-clamp-4">
                          "{book.review}"
                        </blockquote>
                      ) : (
                        <p className="text-sm text-slate-400 italic flex-1">No written review — just a rating.</p>
                      )}
                      {book.moodTags && book.moodTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {book.moodTags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <ReactionBar targetType="book" targetId={book._id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicReviews;
