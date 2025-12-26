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
  Plus,
  Sparkles,
  Image as ImageIcon,
  Clock,
  Target,
} from "lucide-react";
import BookSearchGrid from "@/components/BookSearchGrid";
import QuickAddBookModal from "@/components/QuickAddBookModal";
import ArtUploadImproved from "@/components/ArtUploadImproved";
import QuickReviewCard from "@/components/QuickReviewCard";
import ReadingGoal from "@/components/ReadingGoal";
import { BookResult } from "@/lib/bookSearch";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHover,
} from "@/lib/motion";

type Tab = "books" | "art" | "review";
type Achievement = {
  key: string;
  title: string;
  icon: string;
  description: string;
  earned: boolean;
  color: string;
};

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

  const achievements: Achievement[] = [
    {
      key: "first_steps",
      title: "First Steps",
      icon: "🌟",
      description: "Add your first book or artwork",
      earned: booksRead > 0 || artworks.length > 0,
      color: "yellow",
    },
    {
      key: "bookworm",
      title: "Bookworm",
      icon: "📚",
      description: "Read 5 books",
      earned: booksRead >= 5,
      color: "blue",
    },
    {
      key: "avid_reader",
      title: "Avid Reader",
      icon: "📖",
      description: "Read 10 books",
      earned: booksRead >= 10,
      color: "indigo",
    },
    {
      key: "library_master",
      title: "Library Master",
      icon: "🏰",
      description: "Read 25 books",
      earned: booksRead >= 25,
      color: "emerald",
    },
    {
      key: "artiste",
      title: "Artiste",
      icon: "🎨",
      description: "Upload 5 artworks",
      earned: artworks.length >= 5,
      color: "lime",
    },
    {
      key: "gallery_owner",
      title: "Gallery Owner",
      icon: "🖼️",
      description: "Upload 15 artworks",
      earned: artworks.length >= 15,
      color: "green",
    },
    {
      key: "critic",
      title: "Critic",
      icon: "✍️",
      description: "Write 5 reviews",
      earned: reviews.length >= 5,
      color: "pink",
    },
    {
      key: "review_pro",
      title: "Review Pro",
      icon: "📝",
      description: "Write 15 reviews",
      earned: reviews.length >= 15,
      color: "rose",
    },
    {
      key: "manga_master",
      title: "Manga Master",
      icon: "🗾",
      description: "Read 5 manga/webtoons",
      earned:
        books.filter((b) => b.genre === "Manga" || b.genre === "Webtoon")
          .length >= 5,
      color: "cyan",
    },
    {
      key: "isekai_fan",
      title: "Isekai Fan",
      icon: "🌀",
      description: "Read 3 Isekai books",
      earned: books.filter((b) => b.genre === "Isekai").length >= 3,
      color: "violet",
    },
    {
      key: "page_turner",
      title: "Page Turner",
      icon: "📄",
      description: "Read 1000 pages",
      earned: totalPages >= 1000,
      color: "amber",
    },
    {
      key: "bookshelf_builder",
      title: "Bookshelf Builder",
      icon: "📕",
      description: "Add 20 books to shelf",
      earned: books.length >= 20,
      color: "red",
    },
    {
      key: "streak_starter",
      title: "Streak Starter",
      icon: "🔥",
      description: "3-day reading streak",
      earned: streak >= 3,
      color: "orange",
    },
    {
      key: "dedicated_reader",
      title: "Dedicated Reader",
      icon: "💪",
      description: "7-day reading streak",
      earned: streak >= 7,
      color: "red",
    },
    {
      key: "collector",
      title: "Collector",
      icon: "⭐",
      description: "Mark 5 favorites",
      earned: favorites >= 5,
      color: "yellow",
    },
  ];

  const earnedCount = achievements.filter((a) => a.earned).length;

  // Handle book selection from search
  const handleBookSelect = (book: BookResult) => {
    setSelectedBook(book);
    setShowAddModal(true);
  };

  // Handle after adding book
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
      <main className="py-10">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mb-6" />
          <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="py-10">
        <p>
          Please{" "}
          <Link href="/login" className="text-emerald-500 hover:underline">
            log in
          </Link>{" "}
          to access your dashboard.
        </p>
      </main>
    );
  }

  const tabs = [
    {
      id: "books" as Tab,
      label: "Find Books",
      icon: <Book size={18} />,
      color: "emerald",
    },
    {
      id: "art" as Tab,
      label: "Upload Art",
      icon: <Palette size={18} />,
      color: "lime",
    },
    {
      id: "review" as Tab,
      label: "Write Review",
      icon: <PenLine size={18} />,
      color: "pink",
    },
  ];

  return (
    <main className="py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Welcome back{user.username ? `, ${user.username}` : ""}!
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            What would you like to do today?
          </p>
        </div>
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full"
          >
            <Flame size={20} />
            <span className="font-bold">{streak} day streak!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Stats Bar */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          variants={staggerItem}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <BookOpen size={24} />
            <span className="text-3xl font-bold">{booksRead}</span>
          </div>
          <p className="text-emerald-100 mt-1">Books Read</p>
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <Book size={24} />
            <span className="text-3xl font-bold">{booksReading}</span>
          </div>
          <p className="text-sky-100 mt-1">Currently Reading</p>
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <PenLine size={24} />
            <span className="text-3xl font-bold">{reviews.length}</span>
          </div>
          <p className="text-pink-100 mt-1">Reviews Written</p>
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <ImageIcon size={24} />
            <span className="text-3xl font-bold">{artworks.length}</span>
          </div>
          <p className="text-lime-100 mt-1">Artworks</p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? `bg-white dark:bg-neutral-900 shadow-sm text-${tab.color}-600 dark:text-${tab.color}-400`
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
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
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
            >
              {activeTab === "books" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Find & Add Books
                      </h2>
                      <p className="text-sm text-neutral-500">
                        Search for books by title, author, or ISBN
                      </p>
                    </div>
                    <Link
                      href="/bookshelf"
                      className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      View Bookshelf
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                  <BookSearchGrid onSelectBook={handleBookSelect} />
                </div>
              )}

              {activeTab === "art" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Upload Your Art
                      </h2>
                      <p className="text-sm text-neutral-500">
                        Share your manga-inspired creations
                      </p>
                    </div>
                    <Link
                      href="/gallery"
                      className="flex items-center gap-1 text-sm text-lime-600 hover:text-lime-700 dark:text-lime-400"
                    >
                      View Gallery
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                  <ArtUploadImproved />
                </div>
              )}

              {activeTab === "review" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Write a Review
                      </h2>
                      <p className="text-sm text-neutral-500">
                        Share your thoughts on books you&apos;ve read
                      </p>
                    </div>
                    <Link
                      href="/reviews"
                      className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400"
                    >
                      View All Reviews
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

          {/* Reading Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Reading Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-sm flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  Current Streak
                </span>
                <span className="font-bold text-orange-500">{streak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-sm flex items-center gap-2">
                  <Book size={16} />
                  Total Pages
                </span>
                <span className="font-semibold">
                  {totalPages.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-sm flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  Favorites
                </span>
                <span className="font-semibold text-pink-500">{favorites}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-sm flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
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
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Library size={18} className="text-purple-500" />
                Genre Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(genreStats)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([genre, count], i) => (
                    <div key={genre}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700 dark:text-neutral-300">
                          {genre}
                        </span>
                        <span className="text-neutral-500">{count}</span>
                      </div>
                      <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
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
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                Achievements
              </h3>
              <span className="text-sm text-neutral-500">
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
                    className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-3 py-1 text-xs font-medium"
                    title={a.description}
                  >
                    <span>{a.icon}</span>
                    <span className="text-amber-700 dark:text-amber-300">
                      {a.title}
                    </span>
                  </motion.span>
                ))}
              {earnedCount === 0 && (
                <p className="text-sm text-neutral-500">
                  Start adding books or art to earn badges!
                </p>
              )}
            </div>
            {earnedCount > 0 && earnedCount < achievements.length && (
              <details className="mt-4">
                <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300">
                  View {achievements.length - earnedCount} locked achievements
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {achievements
                    .filter((a) => !a.earned)
                    .map((a) => (
                      <span
                        key={a.key}
                        className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-400"
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
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
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
                      className="flex items-center gap-3 group"
                    >
                      <span
                        className={`p-2 rounded-full ${
                          item.type === "art"
                            ? "bg-lime-100 dark:bg-lime-900/30"
                            : item.type === "review"
                              ? "bg-pink-100 dark:bg-pink-900/30"
                              : "bg-emerald-100 dark:bg-emerald-900/30"
                        }`}
                      >
                        {item.type === "art" ? (
                          <Palette size={14} className="text-lime-600" />
                        ) : item.type === "review" ? (
                          <PenLine size={14} className="text-pink-600" />
                        ) : (
                          <Book size={14} className="text-emerald-600" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              {artworks.length === 0 &&
                reviews.length === 0 &&
                books.length === 0 && (
                  <li className="text-sm text-neutral-500 text-center py-4">
                    No activity yet. Start by adding a book!
                  </li>
                )}
            </ul>
          </motion.div>
        </aside>
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
