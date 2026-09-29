import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Feather, Camera, MessageSquareQuote, Star } from "lucide-react";

interface HomeStatsStripProps {
  booksRead: number;
  reviews: number;
  fiveStars: number;
  writings: number;
  photos: number;
}

const HomeStatsStrip: React.FC<HomeStatsStripProps> = ({
  booksRead,
  reviews,
  fiveStars,
  writings,
  photos,
}) => {
  const items = [
    {
      to: "/books",
      icon: BookOpen,
      value: booksRead,
      label: booksRead === 1 ? "book read" : "books read",
    },
    {
      to: "/reviews",
      icon: MessageSquareQuote,
      value: reviews,
      label: reviews === 1 ? "review" : "reviews",
      hide: reviews === 0,
    },
    {
      to: "/books",
      icon: Star,
      value: fiveStars,
      label: fiveStars === 1 ? "five-star read" : "five-star reads",
      hide: fiveStars === 0,
    },
    {
      to: "/writing",
      icon: Feather,
      value: writings,
      label: writings === 1 ? "piece written" : "pieces written",
      hide: writings === 0,
    },
    {
      to: "/photos",
      icon: Camera,
      value: photos,
      label: photos === 1 ? "photo" : "photos",
      hide: photos === 0,
    },
  ].filter((item) => !item.hide);

  if (items.length === 0 || booksRead === 0) return null;

  return (
    <section className="px-4 py-6 border-y border-slate-200/80 bg-white/50">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {items.map(({ to, icon: Icon, value, label }) => (
          <Link
            key={label}
            to={to}
            className="inline-flex items-center gap-2 min-h-11 text-slate-600 hover:text-primary-700 transition-colors"
          >
            <Icon className="w-4 h-4 text-primary-500" aria-hidden="true" />
            <span className="font-display text-xl font-bold text-slate-800 tabular-nums">
              {value.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeStatsStrip;
