"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api, useAuth } from "@/lib/convex";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Palette,
  PenLine,
  BookOpen,
  Library,
  Star,
  Heart,
  TrendingUp,
  Flame,
  Trophy,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Clock,
  Zap,
} from "lucide-react";
import BookSearchGrid from "@/components/BookSearchGrid";
import QuickAddBookModal from "@/components/QuickAddBookModal";
import ArtUploadImproved from "@/components/ArtUploadImproved";
import QuickReviewCard from "@/components/QuickReviewCard";
import ReadingGoal from "@/components/ReadingGoal";
import { BookResult } from "@/lib/bookSearch";
import { staggerContainer, staggerItem } from "@/lib/motion";

type Tab = "books" | "art" | "review";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const stats: any = useQuery(api.users.getMyStats, token ? { token } : "skip");
  const artworks: any[] =
    useQuery(api.artworks.getMyArtworks, token ? { token } : "skip") ?? [];
  const reviews: any[] =
    useQuery(api.reviews.getMyReviews, token ? { token } : "skip") ?? [];
  const books: any[] =
    useQuery(api.books.getMyBooks, token ? { token } : "skip") ?? [];

  const booksRead = stats?.booksRead ?? 0;
  const booksReading = stats?.booksReading ?? 0;
  const totalPages = stats?.totalPages ?? 0;
  const favorites = stats?.favorites ?? 0;
  const streak = stats?.streak ?? 0;
  const genreStats: Record<string, number> = stats?.genreStats ?? {};
  const topGenre =
    Object.entries(genreStats).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "None yet";

  const achievements = [
    {
      key: "first_steps",
      title: "First Steps",
      icon: "🌟",
      description: "Add your first book or artwork",
      earned: booksRead > 0 || artworks.length > 0,
    },
    {
      key: "bookworm",
      title: "Bookworm",
      icon: "📚",
      description: "Read 5 books",
      earned: booksRead >= 5,
    },
    {
      key: "avid_reader",
      title: "Avid Reader",
      icon: "📖",
      description: "Read 10 books",
      earned: booksRead >= 10,
    },
    {
      key: "library_master",
      title: "Library Master",
      icon: "🏰",
      description: "Read 25 books",
      earned: booksRead >= 25,
    },
    {
      key: "artiste",
      title: "Artiste",
      icon: "🎨",
      description: "Upload 5 artworks",
      earned: artworks.length >= 5,
    },
    {
      key: "gallery_owner",
      title: "Gallery Owner",
      icon: "🖼️",
      description: "Upload 15 artworks",
      earned: artworks.length >= 15,
    },
    {
      key: "critic",
      title: "Critic",
      icon: "✍️",
      description: "Write 5 reviews",
      earned: reviews.length >= 5,
    },
    {
      key: "review_pro",
      title: "Review Pro",
      icon: "📝",
      description: "Write 15 reviews",
      earned: reviews.length >= 15,
    },
    {
      key: "manga_master",
      title: "Manga Master",
      icon: "🗾",
      description: "Read 5 manga/webtoons",
      earned:
        books.filter((b) => b.genre === "Manga" || b.genre === "Webtoon")
          .length >= 5,
    },
    {
      key: "page_turner",
      title: "Page Turner",
      icon: "📄",
      description: "Read 1000 pages",
      earned: totalPages >= 1000,
    },
    {
      key: "streak_starter",
      title: "Streak Starter",
      icon: "🔥",
      description: "3-day reading streak",
      earned: streak >= 3,
    },
    {
      key: "collector",
      title: "Collector",
      icon: "⭐",
      description: "Mark 5 favorites",
      earned: favorites >= 5,
    },
  ];

  const earnedCount = achievements.filter((a) => a.earned).length;

  const handleBookSelect = (book: BookResult) => {
    setSelectedBook(book);
    setShowAddModal(true);
  };

  const handleBookAdded = (bookId: string, action: "shelf" | "review") => {
    setShowAddModal(false);
    setSelectedBook(null);
    if (action === "shelf") {
      router.push("/bookshelf");
    } else {
      router.push(`/write?bookId=${bookId}`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-10 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-10 w-64 bg-gray-200 dark:bg-neutral-800 rounded-xl mb-8" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-gray-200 dark:bg-neutral-800 rounded-2xl"
              />
            ))}
          </div>
          <div className="h-[500px] bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-7xl mb-6"
          >
            📚
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to Elise&apos;s Reading Corner!
          </h1>
          <p className="text-gray-600 mb-8">
            Log in to track your books, share your art, and write amazing
            reviews.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30"
          >
            <Sparkles size={20} />
            Let&apos;s Go!
          </Link>
        </div>
      </main>
    );
  }

  const tabs = [
    {
      id: "books" as Tab,
      label: "Find Books",
      icon: <Book size={18} />,
      emoji: "📚",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "art" as Tab,
      label: "Upload Art",
      icon: <Palette size={18} />,
      emoji: "🎨",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "review" as Tab,
      label: "Write Review",
      icon: <PenLine size={18} />,
      emoji: "✍️",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  // Get display name - use username if set, otherwise "Elise"
  const displayName = user.username || "Elise";

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-neutral-950 dark:to-neutral-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {displayName}!
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="inline-block ml-2"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready for your next reading adventure?
            </p>
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg shadow-orange-500/30"
            >
              <Flame size={20} className="animate-pulse" />
              <span className="font-bold">{streak} day streak!</span>
              <Zap size={16} />
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            variants={staggerItem}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <BookOpen size={22} />
              </div>
              <span className="text-4xl font-bold">{booksRead}</span>
            </div>
            <p className="text-emerald-100 text-sm font-medium">Books Read</p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-sky-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Book size={22} />
              </div>
              <span className="text-4xl font-bold">{booksReading}</span>
            </div>
            <p className="text-sky-100 text-sm font-medium">
              Currently Reading
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg shadow-pink-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <PenLine size={22} />
              </div>
              <span className="text-4xl font-bold">{reviews.length}</span>
            </div>
            <p className="text-pink-100 text-sm font-medium">Reviews Written</p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-violet-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <ImageIcon size={22} />
              </div>
              <span className="text-4xl font-bold">{artworks.length}</span>
            </div>
            <p className="text-violet-100 text-sm font-medium">Artworks</p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="text-lg">{tab.emoji}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-6"
              >
                {activeTab === "books" && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          📚 Find & Add Books
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          Search by title, author, or ISBN
                        </p>
                      </div>
                      <Link
                        href="/bookshelf"
                        className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
                      >
                        My Bookshelf
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                    <BookSearchGrid onSelectBook={handleBookSelect} />
                  </div>
                )}

                {activeTab === "art" && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          🎨 Upload Your Art
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          Share your manga-inspired creations
                        </p>
                      </div>
                      <Link
                        href="/gallery"
                        className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 font-medium"
                      >
                        My Gallery
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                    <ArtUploadImproved />
                  </div>
                )}

                {activeTab === "review" && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          ✍️ Write a Review
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          Share your thoughts on books you&apos;ve read
                        </p>
                      </div>
                      <Link
                        href="/reviews"
                        className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 font-medium"
                      >
                        All Reviews
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                    <QuickReviewCard books={books} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Reading Goal */}
            <ReadingGoal />

            {/* Reading Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-5"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <TrendingUp
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                Reading Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    Current Streak
                  </span>
                  <span className="font-bold text-orange-500">
                    {streak} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    Total Pages
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {totalPages.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-lg">💖</span>
                    Favorites
                  </span>
                  <span className="font-semibold text-pink-500">
                    {favorites}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-lg">🏷️</span>
                    Top Genre
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {topGenre}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Genre Breakdown */}
            {Object.keys(genreStats).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-5"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Library
                      size={16}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  Genre Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(genreStats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([genre, count], i) => (
                      <div key={genre}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {genre}
                          </span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(count / books.length) * 100}%`,
                            }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Trophy
                      size={16}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  Achievements
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                  {earnedCount}/{achievements.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements
                  .filter((a) => a.earned)
                  .map((a) => (
                    <motion.span
                      key={a.key}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 text-xs font-medium cursor-default"
                      title={a.description}
                    >
                      <span>{a.icon}</span>
                      <span className="text-amber-700 dark:text-amber-300">
                        {a.title}
                      </span>
                    </motion.span>
                  ))}
                {earnedCount === 0 && (
                  <p className="text-sm text-gray-500">
                    Start adding books or art to earn badges!
                  </p>
                )}
              </div>
              {earnedCount > 0 && earnedCount < achievements.length && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    🔒 {achievements.length - earnedCount} more to unlock
                  </summary>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {achievements
                      .filter((a) => !a.earned)
                      .map((a) => (
                        <span
                          key={a.key}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-gray-400"
                          title={a.description}
                        >
                          <span className="grayscale opacity-50">{a.icon}</span>
                          <span>{a.title}</span>
                        </span>
                      ))}
                  </div>
                </details>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-5"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                Recent Activity
              </h3>
              <ul className="space-y-3">
                {[
                  ...artworks.slice(0, 3).map((a) => ({
                    type: "art",
                    title: a.title || "Untitled",
                    date: a.createdAt,
                    id: a._id,
                  })),
                  ...reviews.slice(0, 3).map((r) => ({
                    type: "review",
                    title: r.bookTitle,
                    date: r.createdAt,
                    id: r._id,
                  })),
                  ...books.slice(0, 3).map((b) => ({
                    type: "book",
                    title: b.title,
                    date: b.createdAt,
                    id: b._id,
                  })),
                ]
                  .sort((a, b) => b.date - a.date)
                  .slice(0, 5)
                  .map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        href={`/${item.type === "art" ? "artwork" : item.type}/${item.id}`}
                        className="flex items-center gap-3 group p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <span
                          className={`p-2 rounded-xl ${
                            item.type === "art"
                              ? "bg-violet-100 dark:bg-violet-900/30"
                              : item.type === "review"
                                ? "bg-pink-100 dark:bg-pink-900/30"
                                : "bg-emerald-100 dark:bg-emerald-900/30"
                          }`}
                        >
                          {item.type === "art" ? (
                            <Palette
                              size={14}
                              className="text-violet-600 dark:text-violet-400"
                            />
                          ) : item.type === "review" ? (
                            <PenLine
                              size={14}
                              className="text-pink-600 dark:text-pink-400"
                            />
                          ) : (
                            <Book
                              size={14}
                              className="text-emerald-600 dark:text-emerald-400"
                            />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                {artworks.length === 0 &&
                  reviews.length === 0 &&
                  books.length === 0 && (
                    <li className="text-sm text-gray-500 text-center py-6">
                      <Sparkles
                        className="mx-auto mb-2 text-gray-300"
                        size={24}
                      />
                      No activity yet. Start by adding a book!
                    </li>
                  )}
              </ul>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Quick Add Book Modal */}
      <QuickAddBookModal
        book={selectedBook}
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedBook(null);
        }}
        onSuccess={handleBookAdded}
      />
    </main>
  );
}
