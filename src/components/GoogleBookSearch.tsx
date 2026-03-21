import React, { useState, useCallback } from "react";
import { Search, Loader2, BookOpen, Plus } from "lucide-react";

// Google Books categories → our genres
const CATEGORY_MAP: Record<string, string> = {
  "fiction": "Other",
  "juvenile fiction": "Other",
  "young adult fiction": "Other",
  "fantasy": "Fantasy",
  "science fiction": "Sci-Fi",
  "romance": "Romance",
  "mystery": "Mystery",
  "horror": "Horror",
  "action": "Action",
  "adventure": "Action",
  "comedy": "Comedy",
  "humor": "Comedy",
  "humour": "Comedy",
  "drama": "Drama",
  "slice of life": "Slice of Life",
  "coming of age": "Slice of Life",
  "manga": "Manga",
  "manhwa": "Manhwa",
  "webtoon": "Webtoon",
  "light novel": "Light Novel",
  "graphic novel": "Manga",
  "comic": "Manga",
  "cozy": "Slice of Life",
  "dark fantasy": "Fantasy",
  "urban fantasy": "Fantasy",
  "paranormal romance": "Romance",
  "romantic comedy": "Romance",
  "romantasy": "Romance",
  "thriller": "Mystery",
  "suspense": "Mystery",
  "psychological": "Drama",
  "literary fiction": "Drama",
  "contemporary": "Slice of Life",
  "realistic fiction": "Slice of Life",
};

function mapCategoryToGenre(categories: string[] | undefined): string {
  if (!categories || categories.length === 0) return "Other";
  
  for (const cat of categories) {
    const lower = cat.toLowerCase().trim();
    // Direct match
    if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
    // Partial match — check if any mapped key is contained in the category
    for (const [key, genre] of Object.entries(CATEGORY_MAP)) {
      if (lower.includes(key)) return genre;
    }
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

  const searchBooks = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8&orderBy=relevance`,
      );
      const data = await res.json();

      const books: BookResult[] = (data.items || []).map(
        (item: {
          id: string;
          volumeInfo: {
            title?: string;
            authors?: string[];
            imageLinks?: { thumbnail?: string; smallThumbnail?: string };
            pageCount?: number;
            description?: string;
            categories?: string[];
          };
        }) => ({
          id: item.id,
          title: item.volumeInfo.title || "Unknown Title",
          authors: item.volumeInfo.authors || [],
          coverUrl:
            item.volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ||
            item.volumeInfo.imageLinks?.smallThumbnail?.replace("http://", "https://") ||
            "",
          pageCount: item.volumeInfo.pageCount || 0,
          description: item.volumeInfo.description || "",
          genre: mapCategoryToGenre(item.volumeInfo.categories),
        }),
      );

      setResults(books);
    } catch (err) {
      console.error("Google Books search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

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
