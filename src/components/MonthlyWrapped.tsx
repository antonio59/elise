import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BookOpen, PenTool, Palette, Star, Trophy } from "lucide-react";

const MonthlyWrapped: React.FC = () => {
  const books = useQuery(api.books.getMyBooks);
  const writings = useQuery(api.writings.getMyWritings, {});
  const artworks = useQuery(api.artworks.getMyArtworks);
  const streak = useQuery((api as any).readingStreaks.getStreak);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();

    const monthBooks = (books ?? []).filter((b) => b.finishedAt && b.finishedAt >= monthStart && b.finishedAt <= monthEnd);
    const monthWritings = (writings ?? []).filter((w) => w.createdAt >= monthStart && w.createdAt <= monthEnd);
    const monthArt = (artworks ?? []).filter((a) => a.createdAt >= monthStart && a.createdAt <= monthEnd);

    const genreCounts: Record<string, number> = {};
    monthBooks.forEach((b) => {
      if (b.genre) genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    });
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];

    const longestBook = monthBooks.reduce((max, b) => (b.pageCount && b.pageCount > (max?.pageCount ?? 0) ? b : max), monthBooks[0]);
    const totalPages = monthBooks.reduce((sum, b) => sum + (b.pageCount || 0), 0);
    const totalWords = monthWritings.reduce((sum, w) => sum + w.wordCount, 0);

    return {
      monthName: now.toLocaleString("default", { month: "long" }),
      books: monthBooks.length,
      writings: monthWritings.length,
      art: monthArt.length,
      pages: totalPages,
      words: totalWords,
      topGenre: topGenre?.[0],
      longestBook: longestBook?.title,
      streak: streak?.currentStreak ?? 0,
    };
  }, [books, writings, artworks, streak]);

  const hasActivity = stats.books > 0 || stats.writings > 0 || stats.art > 0;

  if (!hasActivity) return null;

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{stats.monthName} Wrapped</h3>
          <p className="text-sm text-slate-500">What you created this month</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 text-center">
          <BookOpen className="w-6 h-6 text-primary-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{stats.books}</p>
          <p className="text-xs text-slate-500">books</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 text-center">
          <PenTool className="w-6 h-6 text-violet-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{stats.writings}</p>
          <p className="text-xs text-slate-500">writings</p>
        </div>
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-4 text-center">
          <Palette className="w-6 h-6 text-accent-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{stats.art}</p>
          <p className="text-xs text-slate-500">artworks</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
          <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{stats.streak}</p>
          <p className="text-xs text-slate-500">day streak</p>
        </div>
      </div>

      {(stats.topGenre || stats.longestBook || stats.pages > 0) && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600">
          {stats.topGenre && <p>🎭 Top genre: <span className="font-medium">{stats.topGenre}</span></p>}
          {stats.longestBook && <p>📖 Longest book: <span className="font-medium">{stats.longestBook}</span></p>}
          {stats.pages > 0 && <p>📄 {stats.pages.toLocaleString()} pages read · {stats.words.toLocaleString()} words written</p>}
        </div>
      )}
    </motion.div>
  );
};

export default MonthlyWrapped;
