import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Palette,
  TrendingUp,
  Plus,
  Sparkles,
  Heart,
  Target,
  X,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = useQuery(api.users.getStats) ?? null;
  const books = useQuery(api.books.getMyBooks) ?? [];
  const artworks = useQuery(api.artworks.getMyArtworks) ?? [];
  const goalProgress = useQuery(api.readingGoals.getGoalProgress);
  const setGoal = useMutation(api.readingGoals.setGoal);

  const [showGoalModal, setShowGoalModal] = useState(false);

  const recentBooks = books.slice(0, 6);
  const recentArtworks = artworks.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
              {user?.name || "Elise"}
            </span>
            !
          </h1>
          <p className="text-slate-500 mt-1">Ready for your next adventure?</p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-500" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {stats?.booksRead ?? 0}
              </p>
              <p className="text-sm text-slate-500">Books Read</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {(stats?.totalPages ?? 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">Pages</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {stats?.totalArtworks ?? 0}
              </p>
              <p className="text-sm text-slate-500">Artworks</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {stats?.favorites ?? 0}
              </p>
              <p className="text-sm text-slate-500">Favorites</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reading Goal Progress */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">
                {goalProgress?.year} Reading Goal
              </h3>
              <p className="text-sm text-slate-500">
                {goalProgress?.goal
                  ? `${goalProgress.booksRead} of ${goalProgress.goal.targetBooks} books`
                  : "No goal set yet"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="btn btn-secondary text-sm"
          >
            {goalProgress?.goal ? "Edit Goal" : "Set Goal"}
          </button>
        </div>

        {goalProgress?.goal ? (
          <div className="space-y-3">
            {/* Book Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Books</span>
                <span className="font-medium text-slate-800">
                  {goalProgress.bookProgress}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress.bookProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Pages Progress (if set) */}
            {goalProgress.goal.targetPages && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Pages</span>
                  <span className="font-medium text-slate-800">
                    {goalProgress.pagesRead.toLocaleString()} /{" "}
                    {goalProgress.goal.targetPages.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress.pageProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 bg-slate-50 rounded-xl">
            <p className="text-slate-500">
              Set a reading goal to track your progress this year!
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          to="/books"
          className="card p-6 hover:border-primary-300 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">My Books</h3>
              <p className="text-slate-500 text-sm">
                {stats?.booksRead ?? 0} read, {stats?.booksReading ?? 0} reading
              </p>
            </div>
            <Plus className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </Link>

        <Link
          to="/art"
          className="card p-6 hover:border-violet-300 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palette className="w-7 h-7 text-violet-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">My Art</h3>
              <p className="text-slate-500 text-sm">
                {stats?.publishedArtworks ?? 0} published
              </p>
            </div>
            <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Recent Books</h2>
          <Link
            to="/books"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentBooks.length === 0 ? (
          <div className="card p-8 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">
              No books yet. Start adding your favorites!
            </p>
            <Link to="/books" className="btn btn-primary">
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentBooks.map(
              (book: {
                _id: string;
                title: string;
                author: string;
                coverUrl?: string;
                status: string;
                rating?: number;
              }) => (
                <div key={book._id} className="group">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg transition-all">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-violet-100">
                        <BookOpen className="w-8 h-8 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 capitalize">
                    {book.status}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Recent Artworks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Recent Art</h2>
          <Link
            to="/art"
            className="text-violet-600 hover:text-violet-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentArtworks.length === 0 ? (
          <div className="card p-8 text-center">
            <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">
              No artworks yet. Show off your creations!
            </p>
            <Link to="/art" className="btn btn-gradient">
              Upload Your First Art
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentArtworks.map(
              (art: { _id: string; title: string; imageUrl: string }) => (
                <div key={art._id} className="group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg transition-all">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                    {art.title}
                  </h3>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Set Goal Modal */}
      <SetGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        currentGoal={goalProgress?.goal}
        year={goalProgress?.year ?? new Date().getFullYear()}
        onSave={async (targetBooks, targetPages) => {
          await setGoal({
            year: goalProgress?.year ?? new Date().getFullYear(),
            targetBooks,
            targetPages: targetPages || undefined,
          });
          setShowGoalModal(false);
        }}
      />
    </div>
  );
};

// Set Goal Modal Component
interface SetGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal?: { targetBooks: number; targetPages?: number } | null;
  year: number;
  onSave: (targetBooks: number, targetPages?: number) => Promise<void>;
}

const SetGoalModal: React.FC<SetGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  year,
  onSave,
}) => {
  const [targetBooks, setTargetBooks] = useState(
    currentGoal?.targetBooks?.toString() || "12",
  );
  const [targetPages, setTargetPages] = useState(
    currentGoal?.targetPages?.toString() || "",
  );
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (currentGoal) {
      setTargetBooks(currentGoal.targetBooks.toString());
      setTargetPages(currentGoal.targetPages?.toString() || "");
    }
  }, [currentGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBooks) return;

    setSaving(true);
    try {
      await onSave(
        parseInt(targetBooks),
        targetPages ? parseInt(targetPages) : undefined,
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {year} Reading Goal
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target Books *
              </label>
              <input
                type="number"
                value={targetBooks}
                onChange={(e) => setTargetBooks(e.target.value)}
                className="input"
                placeholder="e.g., 24"
                min="1"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                How many books do you want to read this year?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target Pages (optional)
              </label>
              <input
                type="number"
                value={targetPages}
                onChange={(e) => setTargetPages(e.target.value)}
                className="input"
                placeholder="e.g., 5000"
                min="1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Optionally set a page count goal too!
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !targetBooks}
              className="btn btn-primary w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Save Goal
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Dashboard;
