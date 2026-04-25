import React, { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, X, BookOpen, Feather, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CoverImage from "./CoverImage";

interface SearchResult {
  id: string;
  type: "book" | "writing" | "artwork";
  title: string;
  subtitle?: string;
  url: string;
  image?: { coverUrl?: string; coverStorageId?: string; title: string; author?: string } | null;
}

const GlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const booksRaw = useQuery(api.books.getReadBooks);
  const books = useMemo(() => booksRaw ?? [], [booksRaw]);
  const writingsRaw = useQuery(api.writings.getPublished, { limit: 100 });
  const writings = useMemo(() => writingsRaw ?? [], [writingsRaw]);
  const artworksRaw = useQuery(api.artworks.getPublished, { limit: 100 });
  const artworks = useMemo(() => artworksRaw ?? [], [artworksRaw]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const out: SearchResult[] = [];

    for (const b of books) {
      if (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.genre && b.genre.toLowerCase().includes(q))
      ) {
        out.push({
          id: b._id,
          type: "book",
          title: b.title,
          subtitle: b.author,
          url: `/books`,
          image: b,
        });
      }
    }

    for (const w of writings) {
      if (
        w.title.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q)
      ) {
        out.push({
          id: w._id,
          type: "writing",
          title: w.title,
          subtitle: w.type,
          url: `/writing`,
        });
      }
    }

    for (const a of artworks) {
      if (a.title.toLowerCase().includes(q)) {
        out.push({
          id: a._id,
          type: "artwork",
          title: a.title,
          url: `/art`,
        });
      }
    }

    return out.slice(0, 8);
  }, [books, writings, artworks, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) setQuery("");
          return !prev;
        });
      }
      if (e.key === "Escape") {
        setQuery("");
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = (url: string) => {
    setQuery("");
    setOpen(false);
    navigate(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
        aria-label="Open search"
      >
        <Search className="w-4 h-4" />
        <span className="text-slate-400">Search...</span>
        <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs bg-white rounded border border-slate-200">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[15vh]">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => { setQuery(""); setOpen(false); }}
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books, writing, art..."
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 rounded">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-auto">
              {results.length === 0 && query.trim() && (
                <div className="px-4 py-8 text-center text-slate-500">
                  No results for “{query.trim()}”
                </div>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  {results.map((r) => (
                    <button
                      key={`${r.type}-${r.id}`}
                      onClick={() => handleSelect(r.url)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      {r.type === "book" && r.image ? (
                        <div className="w-10 h-14 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                          <CoverImage
                            book={r.image}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {r.type === "book" && (
                            <BookOpen className="w-5 h-5 text-slate-400" />
                          )}
                          {r.type === "writing" && (
                            <Feather className="w-5 h-5 text-slate-400" />
                          )}
                          {r.type === "artwork" && (
                            <Palette className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {r.title}
                        </p>
                        {r.subtitle && (
                          <p className="text-sm text-slate-500 capitalize">
                            {r.subtitle}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div className="px-4 py-6 text-sm text-slate-400">
                  Try searching for a book title, writing, or artwork...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
