"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";
import ArtCard, { ArtCardSkeleton } from "@/components/ArtCard";
import Button from "@/components/ui/Button";
import { ArrowRight, Sparkles, BookOpen, Palette } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const books = useQuery(api.books.getPublicBooks, { limit: 12 }) ?? [];
  const artworks = useQuery(api.artworks.getPublished, { limit: 6 }) ?? [];
  const reviews = useQuery(api.reviews.getPublished, { limit: 50 }) ?? [];
  const siteSettings = useQuery(api.siteSettings.get);

  const booksWithReviews = books.slice(0, 6).map((book) => {
    const bookReview = reviews.find((r) => r.bookTitle === book.title);
    return {
      ...book,
      review: book.review || bookReview?.content,
      rating: book.rating || bookReview?.rating || 0,
    };
  });

  const heroTitle = siteSettings?.heroTitle || "My Reading";
  const heroSubtitle = siteSettings?.heroSubtitle || "Adventures";
  const heroDescription =
    siteSettings?.heroDescription ||
    "Welcome to my little corner of the internet! Here I share the books I love and the art I create.";
  const heroImageUrl = siteSettings?.heroImageUrl;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-purple-950/20 dark:via-pink-950/10 dark:to-neutral-950">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-900/80 shadow-sm border border-purple-100 dark:border-purple-900/50 mb-6">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Welcome to my space!
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-gray-900 dark:text-white">
                  {heroTitle}
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  {heroSubtitle}
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto lg:mx-0">
                {heroDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/gallery">
                  <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                    View My Art
                  </Button>
                </Link>
                <Link href="/reviews">
                  <Button variant="secondary" size="lg">
                    Read Reviews
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="mt-10 flex gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {books.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Books
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {artworks.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Artworks
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {reviews.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Floating decorations */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl rotate-12 flex items-center justify-center text-2xl shadow-lg">
                  📚
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl -rotate-12 flex items-center justify-center text-xl shadow-lg">
                  🎨
                </div>

                <div className="w-72 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[450px] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-white dark:border-neutral-800">
                  {heroImageUrl ? (
                    <img
                      src={heroImageUrl}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="text-7xl mb-4 animate-bounce">📖</div>
                      <p className="text-gray-400 dark:text-gray-500 text-sm text-center px-8">
                        Add a hero image in the dashboard
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Reads Section */}
      <section className="py-16 lg:py-20 px-4 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Latest Reads
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {books.length} books in my collection
                </p>
              </div>
            </div>
            <Link href="/bookshelf" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight size={16} />}
              >
                View All
              </Button>
            </Link>
          </div>

          {books === undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-neutral-900 rounded-2xl">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                No books yet!
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Books will appear here once added
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {booksWithReviews.map((book) => (
                <BookCard
                  key={book._id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  rating={book.rating}
                  review={book.review}
                  status={book.status}
                  progress={
                    book.status === "read"
                      ? 100
                      : book.status === "reading"
                        ? 50
                        : 0
                  }
                  onClick={() => router.push(`/book/${book._id}`)}
                />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/bookshelf">
              <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Art Gallery Preview */}
      {artworks.length > 0 && (
        <section className="py-16 lg:py-20 px-4 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/30">
                  <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Art
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Latest creations from the gallery
                  </p>
                </div>
              </div>
              <Link href="/gallery" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight size={16} />}
                >
                  View Gallery
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {artworks.slice(0, 4).map((art) => (
                <ArtCard
                  key={art._id}
                  title={art.title || "Untitled"}
                  imageUrl={art.imageUrl}
                  style={art.style}
                  onClick={() => router.push(`/artwork/${art._id}`)}
                />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/gallery">
                <Button
                  variant="secondary"
                  rightIcon={<ArrowRight size={16} />}
                >
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
