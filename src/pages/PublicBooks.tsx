import CoverImage from "../components/CoverImage";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowLeft, Search, LayoutGrid, List, SlidersHorizontal, Check } from "lucide-react";
import { BookGridSkeleton } from "../components/Skeleton";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const GENRES = [
  "Manga", "Manhwa", "Webtoon", "Light Novel", "Fantasy", "Sci-Fi",
  "Romance", "Mystery", "Horror", "Slice of Life", "Action", "Comedy", "Drama",
];

const genreColors: Record<string, string> = {
  Manga: "bg-red-50 text-red-600 border-red-200",
  Manhwa: "bg-blue-50 text-blue-600 border-blue-200",
  Webtoon: "bg-purple-50 text-purple-600 border-purple-200",
  "Light Novel": "bg-amber-50 text-amber-600 border-amber-200",
  Fantasy: "bg-violet-50 text-violet-600 border-violet-200",
  "Sci-Fi": "bg-cyan-50 text-cyan-600 border-cyan-200",
  Romance: "bg-pink-50 text-pink-600 border-pink-200",
  Mystery: "bg-slate-50 text-slate-600 border-slate-200",
  Horror: "bg-orange-50 text-orange-700 border-orange-200",
  "Slice of Life": "bg-green-50 text-green-600 border-green-200",
  Action: "bg-red-50 text-red-700 border-red-200",
  Comedy: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Drama: "bg-indigo-50 text-indigo-600 border-indigo-200",
};

const PublicBooks: React.FC = () => {
  const books = useQuery(api.books.getReadBooks) ?? [];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showGenres, setShowGenres] = useState(false);

  const genresWithCounts = GENRES.map((g) => ({
    name: g,
    count: books.filter((b) => b.genre === g).length,
  })).filter((g) => g.count > 0);

  const filtered = books.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || (filter === "favorites" && b.isFavorite);
    const matchGenre = !genreFilter || b.genre === genreFilter;
    return matchSearch && matchFilter && matchGenre;
  });

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">Book Shelf</span>
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">Books I've Read</span>
        </h1>
        <p className="text-slate-500 mt-1">everything I've read</p>
      </div>

      {/* Search + Filter + View Toggle */}
      <div className="flex flex-wrap gap-3 mb-4">
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
          className={`btn text-sm ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
        >
          All ({books.length})
        </button>
        <button
          onClick={() => setFilter("favorites")}
          className={`btn text-sm ${filter === "favorites" ? "btn-primary" : "btn-secondary"}`}
        >
          ★ ({books.filter((b) => b.isFavorite).length})
        </button>
        <button
          onClick={() => setShowGenres(!showGenres)}
          className={`btn text-sm ${showGenres ? "btn-primary" : "btn-secondary"}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 text-sm ${viewMode === "grid" ? "bg-primary-500 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-sm ${viewMode === "list" ? "bg-primary-500 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Genre Filter Pills */}
      {showGenres && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            onClick={() => setGenreFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !genreFilter ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {!genreFilter && <Check className="w-3 h-3" />}
            All
          </button>
          {genresWithCounts.map((g) => (
            <button
              key={g.name}
              onClick={() => setGenreFilter(genreFilter === g.name ? null : g.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                genreFilter === g.name
                  ? "bg-primary-500 text-white"
                  : (genreColors[g.name] || "bg-slate-100 text-slate-600")
              }`}
            >
              {genreFilter === g.name && <Check className="w-3 h-3" />}
              {g.name} ({g.count})
            </button>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-slate-600 font-medium">
            {genreFilter ? `No ${genreFilter} books yet` : search ? "No books match your search" : "No books yet"}
          </p>
          {genreFilter && (
            <button onClick={() => setGenreFilter(null)} className="text-sm text-primary-500 mt-2 underline">
              Clear filter
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((book, index) => (
            <motion.div
              key={book._id}
              className="group relative book-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200">
                <CoverImage book={book} className="w-full h-full object-cover" />
                {book.rating && book.rating > 0 && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-0.5">
                    {Array.from({ length: book.rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                )}
              </div>
              <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">{book.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {book.genre && book.genre !== "Other" && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${genreColors[book.genre] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                    {book.genre}
                  </span>
                )}
                {book.rating && book.rating > 0 && (
                  <span className="text-[10px] text-slate-400">{RATING_LABELS[book.rating]}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filtered.map((book, index) => (
            <motion.div
              key={book._id}
              className="card p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="w-14 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <CoverImage book={book} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 truncate">{book.title}</h3>
                <p className="text-sm text-slate-500">{book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  {book.genre && book.genre !== "Other" && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${genreColors[book.genre] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                      {book.genre}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {book.rating && book.rating > 0 ? (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < (book.rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
                    ))}
                  </>
                ) : (
                  <span className="text-xs text-slate-400">unrated</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicBooks;
