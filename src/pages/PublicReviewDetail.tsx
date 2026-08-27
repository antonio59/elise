import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CoverImage from "../components/CoverImage";
import ReactionBar from "../components/ReactionBar";
import StarRating from "../components/StarRating";
import BookMoodTags from "../components/books/BookMoodTags";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { pageMeta } from "../lib/seo";
import { useReducedMotion } from "../hooks/useReducedMotion";

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const PublicReviewDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const prefersReducedMotion = useReducedMotion();
  const book = useQuery(api.books.getById, {
    id: bookId ?? "",
  });
  const allBooks = useQuery(api.books.getReadBooks);

  const moreReviews = useMemo(() => {
    if (!allBooks || !book) return [];
    return allBooks
      .filter(
        (b) =>
          b._id !== book._id &&
          ((b.rating && b.rating > 0) || (b.review && b.review.length > 0)),
      )
      .slice(0, 4);
  }, [allBooks, book]);

  usePageAnnouncement(book?.title ? `Review: ${book.title}` : "Review");
  usePageMeta(
    book
      ? {
          ...pageMeta.reviewDetail(book.title),
          description:
            book.review?.slice(0, 155) ||
            pageMeta.reviewDetail(book.title).description,
          image: book.coverUrl,
        }
      : pageMeta.reviews,
  );

  if (book === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-4 bg-slate-200 rounded w-32" />
        <div className="flex gap-6">
          <div className="w-36 h-52 bg-slate-200 rounded-xl" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (book === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-2xl text-slate-800 mb-2">
          Review not found
        </p>
        <Link to="/reviews" className="btn btn-primary min-h-11 mt-4">
          <ArrowLeft className="w-4 h-4" />
          Back to reviews
        </Link>
      </div>
    );
  }

  const hasReview = Boolean(book.review && book.review.length > 0);

  return (
    <div className="min-h-screen relative">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-50 via-slate-50 to-violet-50/40"
        aria-hidden="true"
      />

      <article className="relative max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <Link
          to="/reviews"
          className="inline-flex items-center gap-1.5 min-h-11 text-sm font-medium text-slate-500 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All reviews
        </Link>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
          className="flex flex-col sm:flex-row gap-8"
        >
          <div className="w-40 sm:w-48 flex-shrink-0 mx-auto sm:mx-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-200/80 bg-slate-100">
              <CoverImage book={book} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold tracking-wide text-primary-600 mb-2">
              What I thought
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-slate-900 leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-slate-500 mb-4">by {book.author}</p>

            {book.rating && book.rating > 0 && (
              <div className="mb-6">
                <StarRating
                  rating={book.rating}
                  size="md"
                  showLabel
                  labels={RATING_LABELS}
                />
              </div>
            )}

            {hasReview ? (
              <blockquote className="text-lg text-slate-700 leading-relaxed border-l-4 border-primary-400 pl-5 italic mb-6">
                &ldquo;{book.review}&rdquo;
              </blockquote>
            ) : (
              <p className="text-slate-500 italic mb-6">
                No written review — just a rating for this one.
              </p>
            )}

            <BookMoodTags moodTags={book.moodTags} bookId={book._id} />

            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap gap-3 items-center">
              <Link
                to={`/books/${book._id}`}
                className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary-300"
              >
                <BookOpen className="w-4 h-4" />
                Book details
              </Link>
              <ReactionBar targetType="book" targetId={book._id} />
            </div>
          </div>
        </motion.div>

        {moreReviews.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-xl text-slate-800 mb-4">
              More reviews
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {moreReviews.map((b) => (
                <Link
                  key={b._id}
                  to={`/reviews/${b._id}`}
                  className="group"
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm ring-1 ring-slate-200/60 group-hover:-translate-y-0.5 transition-transform">
                    <CoverImage book={b} className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800 line-clamp-1">
                    {b.title}
                  </p>
                  {b.rating ? (
                    <p className="text-xs text-primary-600 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-star text-star" />
                      {RATING_LABELS[b.rating]}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default PublicReviewDetail;
