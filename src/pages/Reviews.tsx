import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { ReviewCardSkeleton } from "../components/Skeleton";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import ReviewFilterBar from "../components/reviews/ReviewFilterBar";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewEmptyState from "../components/reviews/ReviewEmptyState";
import type { Book } from "../types/books";

const ReviewsPage: React.FC = () => {
  usePageAnnouncement("Reviews");
  usePageMeta({ title: "Reviews", description: "Book reviews" });
  const booksRaw = useQuery(api.books.getMyBooks);
  const updateBook = useMutation(api.books.update);
  const [filter, setFilter] = useState<
    "all" | "favorites" | "5star" | "4star"
  >("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "title">(
    "recent",
  );

  const books = useMemo(() => booksRaw ?? [], [booksRaw]);

  const { sorted, stats } = useMemo(() => {
    const reviewed = books.filter((b: Book) => b.rating && b.rating > 0);
    const f = reviewed.filter((b: Book) => {
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
    const s = [...f].sort((a: Book, b: Book) => {
      switch (sortBy) {
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    const st = {
      total: reviewed.length,
      fiveStars: reviewed.filter((b: Book) => b.rating === 5).length,
      fourStars: reviewed.filter((b: Book) => b.rating === 4).length,
      favorites: reviewed.filter((b: Book) => b.isFavorite).length,
      withReviews: reviewed.filter(
        (b: Book) => b.review && b.review.length > 0,
      ).length,
    };
    return { sorted: s, stats: st };
  }, [books, filter, sortBy]);

  if (booksRaw === undefined) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <ReviewCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        {stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold font-display text-slate-800">
                {stats.total}
              </div>
              <div className="text-xs text-slate-500">Rated</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold font-display text-star">
                {stats.fiveStars}
              </div>
              <div className="text-xs text-slate-500">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold font-display text-primary-500">
                {stats.fourStars}
              </div>
              <div className="text-xs text-slate-500">⭐⭐⭐⭐</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold font-display text-error-400">
                {stats.favorites}
              </div>
              <div className="text-xs text-slate-500">Favorites</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold font-display text-slate-600">
                {stats.withReviews}
              </div>
              <div className="text-xs text-slate-500">With Reviews</div>
            </div>
          </div>
        )}

        <ReviewFilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {sorted.length === 0 ? (
          <ReviewEmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((book: Book, index: number) => (
              <ReviewCard
                key={book._id}
                book={book}
                index={index}
                onSave={async (bookId, rating, review) => {
                  await updateBook({ id: bookId, rating, review });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
