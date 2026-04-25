import CoverImage from "../components/CoverImage";
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Palette,
  Heart,
  Star,
  MessageSquarePlus,
  Feather,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SuggestBookModal from "../components/books/SuggestBookModal";
import SectionHeader from "../components/SectionHeader";
import { Button } from "../components/ui/Button";
import { BookGridSkeleton, ReviewCardSkeleton } from "../components/Skeleton";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

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

const PublicHome: React.FC = () => {
  usePageAnnouncement("Home");
  usePageMeta({ title: "Home", description: "Books, art & things I think about" });
  const books = useQuery(api.books.getReadBooks);
  const siteSettings = useQuery(api.siteSettings.get);
  const wishlist = useQuery(api.books.getWishlist);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const nowReading = useMemo(() => {
    if (!books) return [];
    return books.filter((b: { status: string }) => b.status === "reading");
  }, [books]);

  const fiveStarBooks = useMemo(() => {
    if (!books) return [];
    return books.filter((b: { rating?: number }) => b.rating === 5);
  }, [books]);

  const booksForGrid = useMemo(() => {
    if (!books) return [];
    return books.filter((b: { status: string }) => b.status !== "reading");
  }, [books]);

  const subtitle =
    (siteSettings?.heroSubtitle as string | undefined) ??
    "books I've read, art I make, and words I write";
  const subtitleWords = subtitle.split(" ");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(siteSettings?.heroTitle as string | undefined) ?? "Elise Reads"}
          </motion.h1>

          {/* Word-stagger subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-slate-500/80 max-w-lg mx-auto mb-8 font-medium italic flex flex-wrap justify-center gap-x-1.5"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.4 },
              },
            }}
          >
            {subtitleWords.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <a href="#books" className="btn btn-secondary">
              <BookOpen className="w-4 h-4" />
              Books
            </a>
            <Link to="/art" className="btn btn-secondary">
              <Palette className="w-4 h-4" />
              Art
            </Link>
            <a href="#writing" className="btn btn-secondary">
              <Feather className="w-4 h-4" />
              Writing
            </a>
            <Button
              variant="secondary"
              icon={<MessageSquarePlus className="w-4 h-4" />}
              onClick={() => setShowSuggestModal(true)}
            >
              Suggest
            </Button>
          </motion.div>
        </div>
      </section>

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

      {/* Reviews Preview */}
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

      {/* Writing & Art Teasers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Feather className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Writing</h3>
            <p className="text-sm text-slate-500 italic">
              stories dropping soon... ✍️
            </p>
            <Link
              to="/writing"
              className="inline-block mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              See all →
            </Link>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Art</h3>
            <p className="text-sm text-slate-500 italic">
              doodles incoming... 🎨
            </p>
            <Link
              to="/art"
              className="inline-block mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              See all →
            </Link>
          </div>
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
                onClick={() => setShowSuggestModal(true)}
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
                    <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {book.author}
                    </p>
                    {book.genre && book.genre !== "Other" && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                        {book.genre}
                      </span>
                    )}
                  </motion.div>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* Suggest a Book Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full shadow-sm mb-6">
              <MessageSquarePlus className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-slate-600">
                Have a book idea?
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Got a recommendation?
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
              Read something good lately? Drop it here.
            </p>

            <Button
              variant="primary"
              size="lg"
              icon={<MessageSquarePlus className="w-5 h-5" />}
              onClick={() => setShowSuggestModal(true)}
            >
              Suggest a Book
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Suggest Book Modal */}
      <SuggestBookModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
};

export default PublicHome;
