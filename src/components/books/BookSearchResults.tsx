import React from "react";
import { Search, Loader2, X } from "lucide-react";
import CoverImage from "../CoverImage";

export interface BookSearchResult {
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
}

interface BookSearchResultsProps {
  query: string;
  setQuery: (value: string) => void;
  results: BookSearchResult[];
  showResults: boolean;
  searching: boolean;
  onSelect: (book: BookSearchResult) => void;
  selectedBook: BookSearchResult | null;
  onClearSelection: () => void;
}

const BookSearchResults: React.FC<BookSearchResultsProps> = ({
  query,
  setQuery,
  results,
  showResults,
  searching,
  onSelect,
  selectedBook,
  onClearSelection,
}) => {
  if (selectedBook) {
    return (
      <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
        <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <CoverImage
            book={selectedBook}
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate">
            {selectedBook.title}
          </h3>
          <p className="text-sm text-slate-600">by {selectedBook.author}</p>
          {selectedBook.genre && (
            <span className="inline-block mt-2 px-2 py-1 bg-slate-50 text-xs font-medium text-primary-600 rounded-full">
              {selectedBook.genre}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClearSelection}
          className="p-1 hover:bg-primary-100 rounded-lg transition-colors"
          aria-label="Clear selection"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Search for a book
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-10"
          placeholder="Type a book title to search..."
          autoFocus
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 animate-spin" />
        )}
      </div>

      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-auto">
          {results.map((book, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(book)}
              className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 transition-colors text-left border-b border-slate-100 last:border-0"
            >
              <CoverImage
                book={book}
                className="w-10 h-14 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {book.title}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {book.author}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-2">
        Can&apos;t find your book? Fill in the details below manually.
      </p>
    </div>
  );
};

export default BookSearchResults;
