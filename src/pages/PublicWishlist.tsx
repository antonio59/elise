import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  BookOpen,
  Sparkles,
  X,
  Check,
  ShoppingBag,
} from "lucide-react";
import CoverImage from "../components/CoverImage";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { getVisitorId } from "../lib/visitorId";
import { BookGridSkeleton } from "../components/Skeleton";
import WishlistGrid from "../components/wishlist/WishlistGrid";
import type { WishlistBook } from "../components/wishlist/WishlistGrid";
import WishlistEmptyState from "../components/wishlist/WishlistEmptyState";
import { pageMeta } from "../lib/seo";
import SuggestBookModal from "../components/books/SuggestBookModal";

function WishlistHero({
  bookCount,
  totalPages,
  onSuggest,
  onShare,
  shareStatus,
}: {
  bookCount: number;
  totalPages: number;
  onSuggest: () => void;
  onShare: () => void;
  shareStatus: "idle" | "copied";
}) {
  return (
    <header className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-primary-100 via-violet-50 to-accent-50 border border-primary-100 px-6 py-10 sm:px-10 sm:py-12 text-center">
      <p className="text-sm font-semibold tracking-wide text-primary-600 mb-2">
        wishlist
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-slate-900 mb-3">
        Next on my nightstand
      </h1>
      <p className="text-slate-600 max-w-lg mx-auto mb-6">
        Books I&apos;d love to read next - suggest one, or grab something from
        the list as a gift.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200">
          <BookOpen className="w-4 h-4 text-primary-500" />
          {bookCount} {bookCount === 1 ? "book" : "books"}
        </span>
        {totalPages > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200">
            ~{totalPages.toLocaleString()} pages
          </span>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onSuggest}
          className="btn btn-primary min-h-11"
        >
          <Sparkles className="w-4 h-4" />
          Suggest a book
        </button>
        <button
          type="button"
          onClick={onShare}
          className="btn btn-secondary min-h-11"
        >
          <Gift className="w-4 h-4" />
          {shareStatus === "copied" ? "Link copied!" : "Share wishlist"}
        </button>
      </div>
    </header>
  );
}

const PublicWishlist: React.FC = () => {
  usePageAnnouncement("Wishlist");
  usePageMeta(pageMeta.wishlist);
  const wishlistBooksRaw = useQuery(api.books.getWishlist);
  const wishlistBooks = (wishlistBooksRaw ?? []) as WishlistBook[];

  const [selectedBook, setSelectedBook] = useState<WishlistBook | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [buyingBookId, setBuyingBookId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyError, setBuyError] = useState("");
  const [buySuccess, setBuySuccess] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const markAsBought = useMutation(api.books.markWishlistAsBought);

  const handleMarkAsBought = async (bookId: string) => {
    if (!buyerName.trim()) {
      setBuyError("Please enter your name");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await markAsBought({
        id: bookId as any,
        boughtBy: buyerName.trim(),
        visitorId: getVisitorId(),
      });
      setBuySuccess(true);
      setTimeout(() => {
        setBuyingBookId(null);
        setBuyerName("");
        setBuyError("");
        setBuySuccess(false);
      }, 2000);
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/wishlist`;
    const shareData = {
      title: "Elise's Reading Wishlist",
      text: "Check out Elise's reading wishlist! Know a great book? Suggest one!",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  const sortedWishlist = [...wishlistBooks].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const totalPages = wishlistBooks.reduce(
    (sum, book) => sum + (book.pageCount || 0),
    0,
  );

  if (wishlistBooksRaw === undefined) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <WishlistHero
          bookCount={0}
          totalPages={0}
          onSuggest={() => setShowSuggestModal(true)}
          onShare={handleShare}
          shareStatus={shareStatus}
        />
        <BookGridSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <WishlistHero
        bookCount={wishlistBooks.length}
        totalPages={totalPages}
        onSuggest={() => setShowSuggestModal(true)}
        onShare={handleShare}
        shareStatus={shareStatus}
      />

      {sortedWishlist.length > 0 ? (
        <WishlistGrid
          books={sortedWishlist}
          onBookClick={setSelectedBook}
        />
      ) : (
        <WishlistEmptyState onSuggestClick={() => setShowSuggestModal(true)} />
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            />

            <motion.div
              className="relative bg-slate-50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              {/* Cover */}
              <div className="relative h-72 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
                <div className="h-56 w-40 shadow-2xl rounded-lg overflow-hidden">
                  <CoverImage
                    book={selectedBook}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Wishlist badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-semibold">On My Wishlist</span>
                </div>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
                  aria-label="Close book detail"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  {selectedBook.title}
                </h2>
                <p className="text-slate-500 mb-4">by {selectedBook.author}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBook.genre && (
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-accent-100 text-accent-600">
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.pageCount && selectedBook.pageCount > 0 && (
                    <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {selectedBook.pageCount} pages
                    </span>
                  )}
                </div>

                {selectedBook.description && (
                  <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 mb-6">
                    <h3 className="font-bold text-slate-700 mb-2 text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary-500" />
                      About this book
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedBook.description}
                    </p>
                  </div>
                )}

                {selectedBook.giftedBy && (
                  <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 mb-6">
                    <p className="text-slate-600 text-sm">
                      <span className="font-medium">Suggested by:</span>{" "}
                      {selectedBook.giftedBy}
                    </p>
                  </div>
                )}

                {!selectedBook.description && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                    <p className="text-slate-500 italic text-center">
                      This book looks amazing and I can&apos;t wait to read it!
                    </p>
                  </div>
                )}

                {/* Bought status / Buy button */}
                <div className="pt-4 border-t border-slate-200">
                  {selectedBook.boughtBy ? (
                    <div className="flex items-center gap-3 bg-success-50 rounded-xl p-4 border border-success-200">
                      <div className="bg-success-500 rounded-full p-2">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-success-700 font-semibold text-sm">
                          Someone got this!
                        </p>
                        <p className="text-success-600 text-xs">
                          Bought by {selectedBook.boughtBy}
                        </p>
                      </div>
                    </div>
                  ) : buyingBookId === selectedBook._id ? (
                    <div className="space-y-3">
                      {buySuccess ? (
                        <div className="flex items-center gap-2 justify-center bg-success-50 rounded-xl p-4">
                          <Check className="w-5 h-5 text-success-500" />
                          <span className="text-success-700 font-semibold">
                            Thank you!
                          </span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-slate-500 text-center">
                            Enter your name so we know who&apos;s getting this
                            book!
                          </p>
                          <input
                            type="text"
                            value={buyerName}
                            onChange={(e) => {
                              setBuyerName(e.target.value);
                              setBuyError("");
                            }}
                            placeholder="Your name"
                            className="input"
                            autoFocus
                          />
                          {buyError && (
                            <p className="text-error-500 text-xs">{buyError}</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleMarkAsBought(selectedBook._id)
                              }
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success-500 hover:bg-success-600 text-white font-semibold rounded-lg transition-colors text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setBuyingBookId(null);
                                setBuyerName("");
                                setBuyError("");
                              }}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => setBuyingBookId(selectedBook._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      I Bought This!
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggest Book Modal */}
      <SuggestBookModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
};

export default PublicWishlist;
