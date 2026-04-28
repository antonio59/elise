import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import CoverImage from "../CoverImage";
import BookMeta from "../books/BookMeta";
import SectionHeader from "../SectionHeader";
import { BookGridSkeleton } from "../Skeleton";

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const FeaturedBooks: React.FC<{
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
        moodTags?: string[];
        status?: string;
        isFavorite?: boolean;
      }>
    | undefined;
  booksForGrid: Array<{
    _id: string;
    title: string;
    author: string;
    coverUrl?: string;
    coverImageUrl?: string | null;
    coverStorageId?: string;
    rating?: number;
    review?: string;
    moodTags?: string[];
  }>;
  nowReading: Array<{
    _id: string;
    title: string;
    author: string;
    coverUrl?: string;
    coverImageUrl?: string | null;
    coverStorageId?: string;
  }>;
  fiveStarBooks: Array<{
    _id: string;
    title: string;
    coverUrl?: string;
    coverImageUrl?: string | null;
    coverStorageId?: string;
  }>;
  wishlist:
    | Array<{
        _id: string;
        title: string;
        author: string;
        coverUrl?: string;
        coverImageUrl?: string | null;
        coverStorageId?: string;
        giftedBy?: string;
        genre?: string;
      }>
    | undefined;
  onSuggestClick: () => void;
}> = ({
  books,
  booksForGrid,
  nowReading,
  fiveStarBooks,
  wishlist,
  onSuggestClick,
}) => {
  return (
    <>
      {/* Now Reading */}
      {nowReading.length > 0 && (
        <section className="py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Now Reading
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {nowReading.map(
                (book: {
                  _id: string;
                  title: string;
                  author: string;
                  coverUrl?: string;
                  coverImageUrl?: string | null;
                  coverStorageId?: string;
                }) => (
                  <motion.div
                    key={book._id}
                    className="flex-shrink-0 w-36"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-shadow">
                      <CoverImage
                        book={book}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                      {book.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {book.author}
                    </p>
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5-Star Shelf — horizontal scroll of top-rated books */}
      {fiveStarBooks.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="5-Star Shelf"
              action={{ label: "See all", to: "/books" }}
            />
            <div className="shelf-scroll">
              {fiveStarBooks.map(
                (book: {
                  _id: string;
                  title: string;
                  coverUrl?: string;
                  coverImageUrl?: string | null;
                  coverStorageId?: string;
                }) => (
                  <div key={book._id} className="w-28 sm:w-32">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                      <CoverImage
                        book={book}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-slate-700 line-clamp-1">
                      {book.title}
                    </p>
                  </div>
                ),
              )}
              {/* Placeholder slots */}
              {Array.from({
                length: Math.max(0, 4 - fiveStarBooks.length),
              }).map((_, i) => (
                <div key={`ph-${i}`} className="w-28 sm:w-32">
                  <div className="aspect-[2/3] rounded-lg border-2 border-dashed border-primary-200 bg-primary-50/50 flex flex-col items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-primary-300" />
                    <span className="text-[10px] text-primary-400 italic">
                      more soon...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Books Section */}
      <section id="books" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <SectionHeader
              title="Books"
              action={
                books && books.length > 0
                  ? { label: "See all", to: "/books" }
                  : undefined
              }
            />
            <p className="text-slate-500 mt-1">
              everything I&apos;ve been reading
            </p>
          </div>

          {books === undefined ? (
            <BookGridSkeleton />
          ) : books.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No books yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {booksForGrid.map(
                (
                  book: {
                    _id: string;
                    title: string;
                    author: string;
                    coverUrl?: string;
                    coverImageUrl?: string | null;
                    coverStorageId?: string;
                    rating?: number;
                    review?: string;
                    moodTags?: string[];
                  },
                  index: number,
                ) => (
                  <motion.div
                    key={book._id}
                    className="group book-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-md book-spine transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                      <CoverImage
                        book={book}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {book.author}
                    </p>
                    {book.rating && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < book.rating!
                                ? "text-star fill-star"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-primary-500 ml-1">
                          {RATING_LABELS[book.rating - 1]}
                        </span>
                      </div>
                    )}
                    {book.review && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                        &quot;{book.review}&quot;
                      </p>
                    )}
                    {book.moodTags && book.moodTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.moodTags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="mood-tag">
                            {tag}
                          </span>
                        ))}
                        {book.moodTags.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{book.moodTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* Wishlist Section */}
      <section id="wishlist" className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <SectionHeader
              title="Wishlist"
              action={
                wishlist && wishlist.length > 0
                  ? { label: "See all", to: "/wishlist" }
                  : undefined
              }
            />
            <p className="text-slate-500 mt-1">
              books I&apos;d love to read next ✨
            </p>
          </div>

          {wishlist === undefined ? (
            <BookGridSkeleton />
          ) : wishlist.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl">
              <div className="text-4xl mb-3">🎁</div>
              <p className="text-slate-600 font-medium">Nothing here yet!</p>
              <p className="text-sm text-slate-500 mt-1">Got a suggestion?</p>
              <button
                onClick={onSuggestClick}
                className="mt-3 text-sm text-primary-500 hover:text-primary-600 font-medium underline underline-offset-2"
              >
                Suggest a book →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {wishlist.map(
                (book: {
                  _id: string;
                  title: string;
                  author: string;
                  coverUrl?: string;
                  coverImageUrl?: string | null;
                  coverStorageId?: string;
                  giftedBy?: string;
                  genre?: string;
                }) => (
                  <motion.div
                    key={book._id}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
                      <CoverImage
                        book={book}
                        className="w-full h-full object-cover"
                      />
                      {book.giftedBy && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-success-500 text-white text-xs rounded-full font-medium">
                          🎁 Gifted by {book.giftedBy}
                        </div>
                      )}
                    </div>
                    <BookMeta
                      title={book.title}
                      author={book.author}
                      genre={book.genre}
                    />
                  </motion.div>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedBooks;
