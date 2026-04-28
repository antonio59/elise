import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import CoverImage from "../CoverImage";
import { BookGridSkeleton } from "../Skeleton";

interface RecentBooksProps {
  books:
    | {
        _id: string;
        title: string;
        author: string;
        coverUrl?: string;
        coverImageUrl?: string | null;
        coverStorageId?: string;
        status: string;
        rating?: number;
      }[]
    | undefined;
  recentBooks: {
    _id: string;
    title: string;
    author: string;
    coverUrl?: string;
    coverImageUrl?: string | null;
    coverStorageId?: string;
    status: string;
    rating?: number;
  }[];
}

const RecentBooks: React.FC<RecentBooksProps> = ({ books, recentBooks }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Recent Books</h2>
        <Link
          to="/dashboard/books"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View all
        </Link>
      </div>

      {books === undefined ? (
        <BookGridSkeleton />
      ) : recentBooks.length === 0 ? (
        <div className="card p-8 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">
            No books yet. Start adding your favorites!
          </p>
          <Link to="/dashboard/books" className="btn btn-primary">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentBooks.map(
            (book: {
              _id: string;
              title: string;
              author: string;
              coverUrl?: string;
              coverImageUrl?: string | null;
              coverStorageId?: string;
              status: string;
              rating?: number;
            }) => (
              <div key={book._id} className="group">
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg transition-all">
                  <CoverImage
                    book={book}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 capitalize">
                  {book.status}
                </p>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default RecentBooks;
