import { getCoverUrl } from "../utils/cover";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen, ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";


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

  const reviewedBooks = books.filter(
    (b: Book) => (b.rating && b.rating > 0) || (b.review && b.review.length > 0)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">Book Reviews</span>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">My Reviews</span>
            </h1>
        <p className="text-slate-500 mt-1">what I thought about these books</p>
      </div>

      {reviewedBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">no reviews yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewedBooks.map((book, index) => (
            <motion.div
              key={book._id}
              className="cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setFlippedId(flippedId === book._id ? null : book._id)}
            >
              <AnimatePresence mode="wait">
                {flippedId !== book._id ? (
                  /* Front: Book Info + Rating */
                  <motion.div
                    key="front"
                    className="card p-5 h-[220px]"
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {getCoverUrl(book) ? (
                          <img
                            src={getCoverUrl(book)}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                            <BookOpen className="w-5 h-5 text-primary-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 line-clamp-1">{book.title}</h3>
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
                          {book.rating && book.rating > 0 && (
                            <span className="ml-2 text-xs text-primary-500 font-medium">
                              {RATING_LABELS[book.rating]}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">tap to see review →</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Back: Full Review */
                  <motion.div
                    key="back"
                    className="card p-5 bg-gradient-to-br from-primary-50 to-white h-[220px]"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-slate-800">{book.title}</h3>
                      <span className="text-xs text-slate-400">tap to flip</span>
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
                      {book.author && <span>by {book.author}</span>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicReviews;
