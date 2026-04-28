import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import CoverImage from "../CoverImage";

interface CurrentlyReadingProps {
  books: {
    _id: string;
    title: string;
    author: string;
    pagesRead?: number;
    pageCount?: number;
    coverUrl?: string;
    coverImageUrl?: string | null;
    coverStorageId?: string;
  }[];
}

const CurrentlyReading: React.FC<CurrentlyReadingProps> = ({ books }) => {
  if (books.length === 0) return null;

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary-500" />
        Currently Reading
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(
          (book: {
            _id: string;
            title: string;
            author: string;
            pagesRead?: number;
            pageCount?: number;
            coverUrl?: string;
            coverImageUrl?: string | null;
            coverStorageId?: string;
          }) => (
            <div
              key={book._id}
              className="flex gap-3 p-3 bg-slate-50 rounded-xl group relative"
            >
              <div className="w-16 h-24 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                <CoverImage
                  book={book}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-slate-800 line-clamp-1">
                    {book.title}
                  </h4>
                  <Link
                    to="/dashboard/books"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
                <p className="text-sm text-slate-500">{book.author}</p>
                {book.pagesRead && book.pageCount && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-400 rounded-full"
                        style={{
                          width: `${Math.min((book.pagesRead / book.pageCount) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {book.pagesRead} / {book.pageCount} pages
                    </p>
                  </div>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </motion.div>
  );
};

export default CurrentlyReading;
