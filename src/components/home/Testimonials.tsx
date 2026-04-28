import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import CoverImage from "../CoverImage";
import SectionHeader from "../SectionHeader";
import { ReviewCardSkeleton } from "../Skeleton";

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const ReviewStrip: React.FC<{
  books: Array<{
    _id: string;
    title: string;
    author: string;
    coverUrl?: string;
    coverImageUrl?: string | null;
    coverStorageId?: string;
    rating?: number;
    review?: string;
    isFavorite?: boolean;
  }>;
}> = ({ books }) => {
  const reviewed = useMemo(
    () => books.filter((b) => b.rating && b.rating > 0),
    [books],
  );

  if (reviewed.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Star className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500">No reviews yet — stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {reviewed.map((book) => (
        <motion.div
          key={book._id}
          className="card p-4 min-w-[260px] flex-shrink-0 hover:shadow-lg transition-shadow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-3">
            <div className="w-16 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              <CoverImage book={book} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-slate-800 line-clamp-1">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 mb-1">{book.author}</p>
              <div className="flex items-center gap-0.5 mb-1">
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
                <span className="text-xs text-slate-500 ml-1">
                  {RATING_LABELS[book.rating ?? 0]}
                </span>
              </div>
              {book.review && (
                <p className="text-xs text-slate-500 line-clamp-3 italic leading-relaxed">
                  &quot;{book.review}&quot;
                </p>
              )}
              {book.isFavorite && (
                <span className="inline-flex items-center gap-1 text-xs text-error-400 font-medium mt-1">
                  <Heart className="w-3 h-3 fill-error-400" />
                  Fav
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Testimonials: React.FC<{
  books:
    | Array<{
        _id: string;
        title: string;
        author: string;
        coverUrl?: string;
        coverImageUrl?: string | null;
        coverStorageId?: string;
        rating?: number;
        review?: string;
        isFavorite?: boolean;
      }>
    | undefined;
}> = ({ books }) => {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Reviews"
          action={{ label: "See all", to: "/reviews" }}
          className="mb-8"
        />
        {books === undefined ? (
          <ReviewCardSkeleton />
        ) : (
          <ReviewStrip books={books} />
        )}
      </div>
    </section>
  );
};

export default Testimonials;
