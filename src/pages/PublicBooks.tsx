import React, { useMemo, useState } from "react";
import { BookGridSkeleton } from "../components/Skeleton";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PageHeader from "../components/PageHeader";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import BookSearchBar from "../components/books/BookSearchBar";
import PublicBookGrid from "../components/books/PublicBookGrid";

const PublicBooks: React.FC = () => {
  usePageAnnouncement("Books");
  usePageMeta({ title: "Books", description: "Everything I've read" });
  const booksRaw = useQuery(api.books.getReadBooks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showGenres, setShowGenres] = useState(false);

  const books = useMemo(() => booksRaw ?? [], [booksRaw]);

  const genresWithCounts = useMemo(
    () =>
      [
        "Manga",
        "Manhwa",
        "Webtoon",
        "Light Novel",
        "Fantasy",
        "Sci-Fi",
        "Romance",
        "Mystery",
        "Horror",
        "Slice of Life",
        "Action",
        "Comedy",
        "Drama",
      ]
        .map((g) => ({
          name: g,
          count: books.filter((b) => b.genre === g).length,
        }))
        .filter((g) => g.count > 0),
    [books],
  );

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" || (filter === "favorites" && b.isFavorite);
      const matchGenre = !genreFilter || b.genre === genreFilter;
      return matchSearch && matchFilter && matchGenre;
    });
  }, [books, search, filter, genreFilter]);

  if (booksRaw === undefined) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <BookGridSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <PageHeader
        badge="Book Shelf"
        title="Books I've Read"
        subtitle="everything I've read"
        breadcrumbs={[{ label: "Books" }]}
      />

      <BookSearchBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        booksCount={books.length}
        favoritesCount={
          books.filter((b: { isFavorite?: boolean }) => b.isFavorite).length
        }
        showGenres={showGenres}
        onToggleGenres={() => setShowGenres(!showGenres)}
        genreFilter={genreFilter}
        onGenreFilterChange={setGenreFilter}
        genresWithCounts={genresWithCounts}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-slate-600 font-medium">
            {genreFilter
              ? `No ${genreFilter} books yet`
              : search
                ? "No books match your search"
                : "No books yet"}
          </p>
          {genreFilter && (
            <button
              onClick={() => setGenreFilter(null)}
              className="text-sm text-primary-500 mt-2 underline"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <PublicBookGrid books={filtered} viewMode={viewMode} />
      )}
    </div>
  );
};

export default PublicBooks;
