"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";
import ArtCard, { ArtCardSkeleton } from "@/components/ArtCard";
import SuggestBookModal from "@/components/SuggestBookModal";
import {
  PageWrapper,
  AnimatedSection,
  FadeIn,
} from "@/components/ui/AnimatedSection";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { ChevronRight, Gift } from "lucide-react";
import { useState } from "react";

type TabType = "all" | "reading" | "read" | "wishlist";

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const books = useQuery(api.books.getPublicBooks, { limit: 20 }) ?? [];
  const artworks = useQuery(api.artworks.getPublished, { limit: 8 }) ?? [];
  const reviews = useQuery(api.reviews.getPublished, { limit: 50 }) ?? [];
  const siteSettings = useQuery(api.siteSettings.get);

  const booksWithReviews = books.map((book) => {
    const bookReview = reviews.find((r) => r.bookTitle === book.title);
    return {
      ...book,
      review: book.review || bookReview?.content,
      rating: book.rating || bookReview?.rating || 0,
    };
  });

  const filteredBooks =
    activeTab === "all"
      ? booksWithReviews
      : booksWithReviews.filter((b) => b.status === activeTab);

  const heroTitle = siteSettings?.heroTitle || "My Reading";
  const heroSubtitle = siteSettings?.heroSubtitle || "Adventures";
  const heroDescription =
    siteSettings?.heroDescription ||
    "Welcome to my corner of the internet where I share the books I love and the art I create.";
  const heroImageUrl = siteSettings?.heroImageUrl;

  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "reading", label: "Reading" },
    { key: "read", label: "Completed" },
    { key: "wishlist", label: "Wishlist" },
  ];

  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero Section - Clean and simple */}
        <section className="border-b border-gray-100 dark:border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Avatar */}
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-xl"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ duration: 0.3 }}
                >
                  {heroImageUrl ? (
                    <img
                      src={heroImageUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <motion.span
                        className="text-5xl"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        👧
                      </motion.span>
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Text */}
              <div className="text-center lg:text-left">
                <motion.h1
                  className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {heroTitle}{" "}
                  <motion.span
                    className="text-emerald-500"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {heroSubtitle}
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-gray-600 dark:text-gray-400 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {heroDescription}
                </motion.p>

                {/* Stats row */}
                <motion.div
                  className="mt-6 flex items-center gap-6 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.p
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {books.length}
                    </motion.p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Books
                    </p>
                  </motion.div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700" />
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.p
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {artworks.length}
                    </motion.p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Artworks
                    </p>
                  </motion.div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700" />
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.p
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {reviews.length}
                    </motion.p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Reviews
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Books Section */}
        <AnimatedSection className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4">
            {/* Section Header with Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  My Books
                </h2>
                <Link
                  href="/bookshelf"
                  className="text-sm text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-0.5 transition-colors"
                >
                  View all
                  <ChevronRight size={14} />
                </Link>
              </motion.div>

              {/* Filter Tabs */}
              <motion.div
                className="flex gap-1 p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.key
                        ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Suggest a Book Button - Show when Wishlist is active */}
            <AnimatePresence>
              {activeTab === "wishlist" && (
                <motion.div
                  className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/50"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-emerald-800 dark:text-emerald-300">
                        Know a great book?
                      </h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Suggest a book you think I&apos;d love to read!
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setShowSuggestModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Gift size={18} />
                      Suggest a Book
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Books Grid */}
            {books === undefined ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <BookCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <motion.div
                className="text-center py-16 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="text-4xl mb-3 block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📚
                </motion.span>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeTab === "all"
                    ? "No books yet"
                    : `No ${activeTab === "read" ? "completed" : activeTab} books`}
                </p>
                {activeTab === "wishlist" && (
                  <motion.button
                    onClick={() => setShowSuggestModal(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Gift size={18} />
                    Suggest a Book
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredBooks.slice(0, 12).map((book, index) => (
                    <motion.div
                      key={book._id}
                      variants={staggerItem}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BookCard
                        title={book.title}
                        author={book.author}
                        coverUrl={book.coverUrl}
                        rating={book.rating}
                        genre={book.genre}
                        status={book.status}
                        isNew={index < 2}
                        index={index}
                        onClick={() => router.push(`/book/${book._id}`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </AnimatedSection>

        {/* Art Gallery Section */}
        <AnimatePresence>
          {artworks.length > 0 && (
            <AnimatedSection className="py-8 lg:py-12 border-t border-gray-100 dark:border-neutral-800">
              <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    My Art
                  </h2>
                  <Link
                    href="/gallery"
                    className="text-sm text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-0.5 transition-colors"
                  >
                    View all
                    <ChevronRight size={14} />
                  </Link>
                </motion.div>

                {/* Art Grid */}
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {artworks.slice(0, 5).map((art, index) => (
                    <motion.div key={art._id} variants={staggerItem}>
                      <ArtCard
                        title={art.title || "Untitled"}
                        imageUrl={art.imageUrl}
                        style={art.style}
                        isNew={index === 0}
                        index={index}
                        onClick={() => router.push(`/artwork/${art._id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </AnimatedSection>
          )}
        </AnimatePresence>

        {/* Quick Links / Categories - Webtoons style */}
        <AnimatedSection className="py-8 lg:py-12 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Explore
              </h2>
            </FadeIn>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  href: "/bookshelf",
                  emoji: "📚",
                  title: "Bookshelf",
                  count: `${books.length} books`,
                },
                {
                  href: "/gallery",
                  emoji: "🎨",
                  title: "Gallery",
                  count: `${artworks.length} artworks`,
                },
                {
                  href: "/reviews",
                  emoji: "✍️",
                  title: "Reviews",
                  count: `${reviews.length} reviews`,
                },
                {
                  href: "/explore",
                  emoji: "🔍",
                  title: "Discover",
                  count: "Find new books",
                },
              ].map((item) => (
                <motion.div key={item.href} variants={staggerItem}>
                  <Link
                    href={item.href}
                    className="group block p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all"
                  >
                    <motion.span
                      className="text-2xl mb-2 block"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.emoji}
                    </motion.span>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.count}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Suggest Book Modal */}
        <SuggestBookModal
          isOpen={showSuggestModal}
          onClose={() => setShowSuggestModal(false)}
        />
      </main>
    </PageWrapper>
  );
}
