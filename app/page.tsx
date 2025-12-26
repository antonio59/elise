"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";
import ArtCard, { ArtCardSkeleton } from "@/components/ArtCard";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

type TabType = "all" | "reading" | "read" | "wishlist";

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");

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
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section - Clean and simple */}
      <section className="border-b border-gray-100 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-xl">
                {heroImageUrl ? (
                  <img
                    src={heroImageUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">👧</span>
                  </div>
                )}
              </div>
            </div>

            {/* Text */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {heroTitle}{" "}
                <span className="text-emerald-500">{heroSubtitle}</span>
              </h1>
              <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-lg">
                {heroDescription}
              </p>

              {/* Stats row */}
              <div className="mt-6 flex items-center gap-6 justify-center lg:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {books.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Books
                  </p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {artworks.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Artworks
                  </p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {reviews.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section Header with Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
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
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab.key
                      ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          {books === undefined ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-neutral-900 rounded-lg">
              <span className="text-4xl mb-3 block">📚</span>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === "all"
                  ? "No books yet"
                  : `No ${activeTab === "read" ? "completed" : activeTab} books`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredBooks.slice(0, 12).map((book, index) => (
                <BookCard
                  key={book._id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  rating={book.rating}
                  genre={book.genre}
                  status={book.status}
                  isNew={index < 2}
                  onClick={() => router.push(`/book/${book._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Art Gallery Section */}
      {artworks.length > 0 && (
        <section className="py-8 lg:py-12 border-t border-gray-100 dark:border-neutral-800">
          <div className="max-w-6xl mx-auto px-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
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
            </div>

            {/* Art Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artworks.slice(0, 5).map((art, index) => (
                <ArtCard
                  key={art._id}
                  title={art.title || "Untitled"}
                  imageUrl={art.imageUrl}
                  style={art.style}
                  isNew={index === 0}
                  onClick={() => router.push(`/artwork/${art._id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links / Categories - Webtoons style */}
      <section className="py-8 lg:py-12 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Explore
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/bookshelf"
              className="group p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2 block">📚</span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Bookshelf
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {books.length} books
              </p>
            </Link>
            <Link
              href="/gallery"
              className="group p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2 block">🎨</span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Gallery
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {artworks.length} artworks
              </p>
            </Link>
            <Link
              href="/reviews"
              className="group p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2 block">✍️</span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Reviews
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {reviews.length} reviews
              </p>
            </Link>
            <Link
              href="/explore"
              className="group p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2 block">🔍</span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Discover
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Find new books
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
