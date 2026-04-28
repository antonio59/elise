import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Palette,
  TrendingUp,
  PenTool,
  Heart,
  Camera,
} from "lucide-react";
import { Skeleton } from "../Skeleton";

interface Stats {
  booksRead?: number;
  totalPages?: number;
  totalArtworks?: number;
  totalPhotos?: number;
  favorites?: number;
}

interface WritingStats {
  total?: number;
}

interface DashboardStatsProps {
  stats: Stats | null | undefined;
  writingStats: WritingStats | null | undefined;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  writingStats,
}) => {
  if (stats === undefined) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  return (
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
            <p className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-800">
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-800">
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-800">
              {writingStats?.total ?? 0}
            </p>
            <p className="text-sm text-slate-500">Written</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-800">
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
        transition={{ delay: 0.26 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-800">
              {stats?.totalPhotos ?? 0}
            </p>
            <p className="text-sm text-slate-500">Photos</p>
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
            <p className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-800">
              {stats?.favorites ?? 0}
            </p>
            <p className="text-sm text-slate-500">Favorites</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
