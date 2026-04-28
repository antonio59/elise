import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, PenTool, Palette, Camera, Plus } from "lucide-react";

interface Stats {
  booksRead?: number;
  booksReading?: number;
  publishedArtworks?: number;
  publishedPhotos?: number;
}

interface WritingStats {
  total?: number;
  totalWords?: number;
}

interface QuickActionsProps {
  stats: Stats | null | undefined;
  writingStats: WritingStats | null | undefined;
}

const QuickActions: React.FC<QuickActionsProps> = ({ stats, writingStats }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link
        to="/dashboard/books"
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
        to="/dashboard/writing"
        className="card p-6 hover:border-violet-300 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PenTool className="w-7 h-7 text-violet-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">My Writing</h3>
            <p className="text-slate-500 text-sm">
              {writingStats?.total ?? 0} pieces ·{" "}
              {(writingStats?.totalWords ?? 0).toLocaleString()} words
            </p>
          </div>
          <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
        </div>
      </Link>

      <Link
        to="/dashboard/art"
        className="card p-6 hover:border-accent-300 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Palette className="w-7 h-7 text-accent-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">My Art</h3>
            <p className="text-slate-500 text-sm">
              {stats?.publishedArtworks ?? 0} published
            </p>
          </div>
          <Plus className="w-5 h-5 text-slate-400 group-hover:text-accent-500 transition-colors" />
        </div>
      </Link>

      <Link
        to="/dashboard/photos"
        className="card p-6 hover:border-teal-300 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-7 h-7 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">My Photos</h3>
            <p className="text-slate-500 text-sm">
              {stats?.publishedPhotos ?? 0} published
            </p>
          </div>
          <Plus className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
        </div>
      </Link>
    </div>
  );
};

export default QuickActions;
