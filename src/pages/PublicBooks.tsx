import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, ArrowLeft, Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";

function fixCoverUrl(url: string | undefined): string | undefined {
  return url?.replace(/&amp;/g, "&");
}

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const PublicBooks: React.FC = () => {
  const books = useQuery(api.books.getReadBooks) ?? [];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const filtered = books.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || (filter === "favorites" && b.isFavorite);
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Books</h1>
        <p className="text-slate-500 mt-1">everything I've read</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search books..."
          />
        </div>
        <button
          onClick={() => setFilter("all")}
          className={`btn text-sm ${
            filter === "all" ? "btn-primary" : "btn-secondary"
          }`}
        >
          All ({books.length})
        </button>
        <button
          onClick={() => setFilter("favorites")}
          className={`btn text-sm ${
            filter === "favorites" ? "btn-primary" : "btn-secondary"
          }`}
        >
          Favorites ({books.filter((b) => b.isFavorite).length})
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            {search ? "no books match your search" : "no books yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((book, index) => (
            <motion.div
              key={book._id}
              className="group relative book-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
                {fixCoverUrl(book.coverUrl) ? (
                  <img
                    src={fixCoverUrl(book.coverUrl)}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                    <BookOpen className="w-8 h-8 text-primary-400" />
                  </div>
                )}
                {book.rating && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1 bg-black/50 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-medium">
                      {book.rating}
                    </span>
                  </div>
                )}
                {book.isFavorite && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">❤️</span>
                  </div>
                )}
              </div>
              <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {book.genre && book.genre !== "Other" && (
                  <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                    {book.genre}
                  </span>
                )}
                {book.rating && book.rating > 0 && (
                  <span className="text-xs text-slate-400">
                    {RATING_LABELS[book.rating]}
                  </span>
                )}
              </div>
              {book.review && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                  "{book.review}"
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicBooks;
