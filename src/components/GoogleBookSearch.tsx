/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, Loader2, BookOpen, Plus } from "lucide-react";

// Google Books categories → our genres
const CATEGORY_MAP: Record<string, string> = {
  // Fiction subgenres
  "fantasy": "Fantasy",
  "science fiction": "Sci-Fi",
  "sci-fi": "Sci-Fi",
  "romance": "Romance",
  "mystery": "Mystery",
  "horror": "Horror",
  "action": "Action",
  "adventure": "Action",
  "comedy": "Comedy",
  "humor": "Comedy",
  "drama": "Drama",
  "slice of life": "Slice of Life",
  "manga": "Manga",
  "manhwa": "Manhwa",
  "webtoon": "Webtoon",
  "light novel": "Light Novel",
  "graphic novel": "Manga",
  "comic": "Manga",
  // Broad → specific
  "young adult fiction": "Drama",
  "young adult romance": "Romance",
  "young adult fantasy": "Fantasy",
  "juvenile fiction": "Drama",
  "juvenile fantasy": "Fantasy",
  "paranormal": "Horror",
  "thriller": "Mystery",
  "suspense": "Mystery",
  "detective": "Mystery",
  "crime": "Mystery",
  "cozy": "Slice of Life",
  "coming of age": "Drama",
  "contemporary": "Slice of Life",
  "literary fiction": "Drama",
  "historical": "Drama",
  "dark fantasy": "Fantasy",
  "urban fantasy": "Fantasy",
  "paranormal romance": "Romance",
  "romantic comedy": "Romance",
  "romantasy": "Romance",
  "psychological": "Drama",
  "realistic fiction": "Slice of Life",
};

// Keyword-based genre detection from description
function detectGenreFromText(text: string): string {
  const lower = text.toLowerCase();
  const checks: [string, string][] = [
    ["manga", "Manga"],
    ["manhwa", "Manhwa"],
    ["webtoon", "Webtoon"],
    ["light novel", "Light Novel"],
    ["graphic novel", "Manga"],
    ["enemies to lovers", "Romance"],
    ["love story", "Romance"],
    ["romantic", "Romance"],
    ["romance", "Romance"],
    ["fantasy world", "Fantasy"],
    ["magical", "Fantasy"],
    ["wizard", "Fantasy"],
    ["witch", "Fantasy"],
    ["dragon", "Fantasy"],
    ["fantasy", "Fantasy"],
    ["science fiction", "Sci-Fi"],
    ["dystopian", "Sci-Fi"],
    ["space", "Sci-Fi"],
    ["alien", "Sci-Fi"],
    ["futuristic", "Sci-Fi"],
    ["murder mystery", "Mystery"],
    ["detective", "Mystery"],
    ["thriller", "Mystery"],
    ["whodunit", "Mystery"],
    ["mystery", "Mystery"],
    ["haunted", "Horror"],
    ["horror", "Horror"],
    ["scary", "Horror"],
    ["fighting", "Action"],
    ["battle", "Action"],
    ["war", "Action"],
    ["cozy", "Slice of Life"],
    ["coming of age", "Drama"],
    ["slice of life", "Slice of Life"],
    ["funny", "Comedy"],
    ["humor", "Comedy"],
    ["humour", "Comedy"],
  ];
  for (const [keyword, genre] of checks) {
    if (lower.includes(keyword)) return genre;
  }
  return "Other";
}

function mapCategoryToGenre(categories: string[] | undefined, description?: string): string {
  // First try exact category match
  if (categories) {
    for (const cat of categories) {
      const lower = cat.toLowerCase().trim();
      if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
      for (const [key, genre] of Object.entries(CATEGORY_MAP)) {
        if (lower.includes(key)) return genre;
      }
    }
  }
  // Fall back to description keyword detection
  if (description) {
    return detectGenreFromText(description);
  }
  return "Other";
}

interface BookResult {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string;
  pageCount: number;
  description: string;
  genre: string;
}

interface GoogleBookSearchProps {
  onSelect: (book: {
    title: string;
    author: string;
    coverUrl: string;
    pageCount: number;
    description: string;
    genre: string;
  }) => void;
}

const GoogleBookSearch: React.FC<GoogleBookSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const convex = useConvex();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const searchBooks = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const items = await convex.action((api as any).googleBooks.search, { query });

      const books: BookResult[] = (items || []).map(
        (item: { id: string; title: string; authors: string[]; coverUrl: string; pageCount: number; description: string; categories: string[] }) => ({
          id: item.id,
          title: item.title,
          authors: item.authors,
          coverUrl: item.coverUrl,
          pageCount: item.pageCount,
          description: item.description,
          genre: mapCategoryToGenre(item.categories, item.description),
        }),
      );

      setResults(books);
    } catch (err) {
      console.error("Google Books search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, convex]);

  // Auto-search after 500ms of no typing
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchBooks();
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query, searchBooks]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBooks();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Search Google Books
      </label>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input pl-9"
            placeholder="Search by title, author, or ISBN..."
          />
        </div>
        <button
          type="button"
          onClick={searchBooks}
          disabled={loading || !query.trim()}
          className="btn btn-secondary"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="border border-slate-200 rounded-lg max-h-64 overflow-y-auto">
          {results.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => {
                onSelect({
                  title: book.title,
                  author: book.authors.join(", "),
                  coverUrl: book.coverUrl,
                  pageCount: book.pageCount,
                  description: book.description,
                  genre: book.genre,
                });
                setResults([]);
                setQuery(book.title);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
            >
              <div className="w-10 h-14 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {book.title}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {book.authors.join(", ") || "Unknown author"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {book.genre !== "Other" && (
                    <span className="text-xs text-primary-500 font-medium">{book.genre}</span>
                  )}
                  {book.pageCount > 0 && (
                    <span className="text-xs text-slate-400">{book.pageCount} pages</span>
                  )}
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">
          No books found. Try a different search.
        </p>
      )}
    </div>
  );
};

export default GoogleBookSearch;
