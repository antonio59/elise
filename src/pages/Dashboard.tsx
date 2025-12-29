import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Palette,
  Star,
  TrendingUp,
  Plus,
  Sparkles,
  Heart,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = useQuery(api.users.getStats) ?? null;
  const books = useQuery(api.books.getMyBooks) ?? [];
  const artworks = useQuery(api.artworks.getMyArtworks) ?? [];

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
    </div>
  );
};

export default Dashboard;
