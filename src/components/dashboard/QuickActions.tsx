import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, PenTool, Palette, Camera } from "lucide-react";

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

const QuickActions: React.FC<QuickActionsProps> = ({
  stats,
  writingStats,
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link
        to="/dashboard/books"
        className="card p-6 hover:border-primary-300 transition-colors group min-h-[44px]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="w-7 h-7 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">My Books</h3>
            <p className="text-slate-500 text-sm">
              {stats?.booksRead ?? 0} read, {stats?.booksReading ?? 0} reading
            </p>
          </div>
        </div>
      </Link>

      <Link
        to="/dashboard/writing"
        className="card p-6 hover:border-slate-300 transition-colors group min-h-[44px]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <PenTool className="w-7 h-7 text-violet-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">Writing</h3>
            <p className="text-slate-500 text-sm">
              {writingStats?.total ?? 0} pieces ·{" "}
              {(writingStats?.totalWords ?? 0).toLocaleString()} words
            </p>
          </div>
        </div>
      </Link>

      <Link
        to="/dashboard/art"
        className="card p-6 hover:border-accent-300 transition-colors group min-h-[44px]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Palette className="w-7 h-7 text-accent-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">Art</h3>
            <p className="text-slate-500 text-sm">
              {stats?.publishedArtworks ?? 0} published
            </p>
          </div>
        </div>
      </Link>

      <Link
        to="/dashboard/photos"
        className="card p-6 hover:border-slate-300 transition-colors group min-h-[44px]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-7 h-7 text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">Photos</h3>
            <p className="text-slate-500 text-sm">
              {stats?.publishedPhotos ?? 0} published
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default QuickActions;
