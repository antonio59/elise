import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Star, Calendar, Hash } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CoverImage from "../components/CoverImage";
import ReactionBar from "../components/ReactionBar";
import PageHeader from "../components/PageHeader";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

interface Book {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
  genre?: string;
  series?: string;
  pageCount?: number;
  description?: string;
  status: "reading" | "read" | "wishlist";
  rating?: number;
  review?: string;
  isFavorite?: boolean;
  moodTags?: string[];
  startedAt?: number;
  finishedAt?: number;
  createdAt: number;
}

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const PublicBookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookId = id as unknown as string;
  const book = useQuery(api.books.getById, {
    id: bookId as never,
  }) as Book | undefined | null;

  usePageAnnouncement(book?.title || "Book");
  usePageMeta({
    title: book?.title || "Book",
    description: book?.review || `${book?.title} by ${book?.author}`,
  });

  // Loading
  if (book === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 h-80 bg-slate-200 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="h-5 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (book === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📖</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Book not found</h1>
        <p className="text-slate-500 mb-6">This book might have been removed or the link is broken.</p>
        <Link to="/books" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </Link>
      </div>
    );
  }

  const formattedDate = (ts?: number) => {
    if (!ts) return null;
    return new Date(ts).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
      <PageHeader
        badge="Book Details"
        title={book.title}
        subtitle={`by ${book.author}`}
        breadcrumbs={[
          { label: "Books", to: "/books" },
          { label: book.title },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="w-full md:w-64 rounded-xl overflow-hidden shadow-lg bg-slate-100">
              <CoverImage
                book={book}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            {/* Status badge */}
            <div className="flex flex-wrap gap-2">
              {book.status === "reading" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                  <BookOpen className="w-3.5 h-3.5" />
                  Currently Reading
                </span>
              )}
              {book.status === "read" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  <BookOpen className="w-3.5 h-3.5" />
                  Finished Reading
                </span>
              )}
              {book.genre && (
                <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-sm font-medium border border-violet-200">
                  {book.genre}
                </span>
              )}
              {book.isFavorite && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm font-medium border border-pink-200">
                  <Star className="w-3 h-3 fill-pink-400" />
                  Favourite
                </span>
              )}
            </div>

            {/* Rating */}
            {book.rating && book.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= book.rating!
                          ? "text-star fill-star"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {RATING_LABELS[book.rating]}
                </span>
              </div>
            )}

            {/* Series */}
            {book.series && (
              <p className="text-sm text-slate-500">
                Part of the{" "}
                <span className="font-medium text-slate-700">{book.series}</span>{" "}
                series
              </p>
            )}

            {/* Page count */}
            {book.pageCount && (
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                {book.pageCount} pages
              </p>
            )}

            {/* Dates */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              {book.startedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Started {formattedDate(book.startedAt)}
                </span>
              )}
              {book.finishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Finished {formattedDate(book.finishedAt)}
                </span>
              )}
            </div>

            {/* Review */}
            {book.review && (
              <div className="card p-5 bg-gradient-to-br from-violet-50/50 to-white">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Elise's Review
                </h3>
                <blockquote className="text-slate-700 leading-relaxed border-l-4 border-primary-300 pl-4 italic">
                  &ldquo;{book.review}&rdquo;
                </blockquote>
              </div>
            )}

            {/* Description */}
            {book.description && !book.review && (
              <div className="card p-5">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                  About This Book
                </h3>
                <p className="text-slate-600 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Mood tags */}
            {book.moodTags && book.moodTags.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Mood
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {book.moodTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reactions */}
            <div className="pt-2 border-t border-slate-100">
              <ReactionBar targetType="book" targetId={book._id} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicBookDetail;
