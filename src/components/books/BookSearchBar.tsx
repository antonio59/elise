import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import { Button } from "../ui/Button";

const genreColors: Record<string, string> = {
  Manga: "bg-error-50 text-error-600 border-error-200",
  Manhwa: "bg-blue-50 text-accent-600 border-blue-200",
  Webtoon: "bg-purple-50 text-purple-600 border-purple-200",
  "Light Novel": "bg-amber-50 text-amber-600 border-amber-200",
  Fantasy: "bg-violet-50 text-violet-600 border-violet-200",
  "Sci-Fi": "bg-cyan-50 text-cyan-600 border-cyan-200",
  Romance: "bg-pink-50 text-primary-600 border-pink-200",
  Mystery: "bg-slate-50 text-slate-600 border-slate-200",
  Horror: "bg-orange-50 text-orange-700 border-orange-200",
  "Slice of Life": "bg-success-50 text-success-600 border-success-200",
  Action: "bg-error-50 text-red-700 border-error-200",
  Comedy: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Drama: "bg-indigo-50 text-indigo-600 border-indigo-200",
};

interface GenreCount {
  name: string;
  count: number;
}

interface BookSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: "all" | "favorites";
  onFilterChange: (filter: "all" | "favorites") => void;
  booksCount: number;
  favoritesCount: number;
  showGenres: boolean;
  onToggleGenres: () => void;
  genreFilter: string | null;
  onGenreFilterChange: (genre: string | null) => void;
  genresWithCounts: GenreCount[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const BookSearchBar: React.FC<BookSearchBarProps> = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  booksCount,
  favoritesCount,
  showGenres,
  onToggleGenres,
  genreFilter,
  onGenreFilterChange,
  genresWithCounts,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-9"
            placeholder="Search books..."
          />
        </div>
        <Button
          variant={filter === "all" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          All ({booksCount})
        </Button>
        <Button
          variant={filter === "favorites" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onFilterChange("favorites")}
        >
          <Star className="w-3.5 h-3.5" /> ({favoritesCount})
        </Button>
        <Button
          variant={showGenres ? "primary" : "secondary"}
          size="sm"
          onClick={onToggleGenres}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          <button
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={`px-3 py-1.5 text-sm ${
              viewMode === "grid"
                ? "bg-primary-500 text-white"
                : "bg-slate-50 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={`px-3 py-1.5 text-sm ${
              viewMode === "list"
                ? "bg-primary-500 text-white"
                : "bg-slate-50 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showGenres && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            onClick={() => onGenreFilterChange(null)}
            aria-pressed={!genreFilter}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !genreFilter
                ? "bg-primary-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {!genreFilter && <Check className="w-3 h-3" />}
            All
          </button>
          {genresWithCounts.map((g) => (
            <button
              key={g.name}
              onClick={() =>
                onGenreFilterChange(genreFilter === g.name ? null : g.name)
              }
              aria-pressed={genreFilter === g.name}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                genreFilter === g.name
                  ? "bg-primary-500 text-white"
                  : genreColors[g.name] || "bg-slate-100 text-slate-600"
              }`}
            >
              {genreFilter === g.name && <Check className="w-3 h-3" />}
              {g.name} ({g.count})
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default BookSearchBar;
