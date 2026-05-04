import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import CoverImage from "../CoverImage";
import StickerSection from "../StickerSection";
import ShareButton from "../ShareButton";

const RATING_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

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

interface PublicBookGridProps {
  books: {
    _id: string;
    title: string;
    author: string;
    coverUrl?: string;
    coverImageUrl?: string | null;
    coverStorageId?: string;
    genre?: string;
    rating?: number;
  }[];
  viewMode: "grid" | "list";
}

const PublicBookGrid: React.FC<PublicBookGridProps> = ({
  books,
  viewMode,
}) => {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book, index) => (
            <motion.div
              key={book._id}
              className="group relative book-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <Link to={`/books/${book._id}`} className="block">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200">
                <CoverImage
                  book={book}
                  className="w-full h-full object-cover"
                />
                {book.rating && book.rating > 0 && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/50 backdrop-blur-sm rounded-full flex items-center gap-0.5">
                    {Array.from({ length: book.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-2.5 h-2.5 text-star fill-star"
                      />
                    ))}
                  </div>
                )}
              </div>
              <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                {book.author}
              </p>
              </Link>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {book.genre && book.genre !== "Other" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                      genreColors[book.genre] ||
                      "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {book.genre}
                  </span>
                )}
                {book.rating && book.rating > 0 && (
                  <span className="text-[10px] text-slate-400">
                    {RATING_LABELS[book.rating]}
                  </span>
                )}
                <ShareButton
                  title={book.title}
                  author={book.author}
                  bookId={book._id}
                />
              </div>
              <StickerSection bookId={book._id} />
            </motion.div>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {books.map((book, index) => (
          <motion.div
            key={book._id}
            className="card p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
          >
            <Link to={`/books/${book._id}`} className="flex gap-4 items-center flex-1 min-w-0">
            <div className="w-14 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              <CoverImage
                book={book}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-800 truncate hover:text-primary-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-slate-500">{book.author}</p>
              <div className="flex items-center gap-2 mt-1">
                {book.genre && book.genre !== "Other" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                      genreColors[book.genre] ||
                      "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {book.genre}
                  </span>
                )}
              </div>
            </div>
            </Link>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {book.rating && book.rating > 0 ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (book.rating ?? 0)
                          ? "text-star fill-star"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </>
              ) : (
                <span className="text-xs text-slate-500">unrated</span>
              )}
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
};

export default PublicBookGrid;
