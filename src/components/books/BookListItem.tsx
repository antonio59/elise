import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Star } from "lucide-react";
import CoverImage from "../CoverImage";
import BookMeta from "./BookMeta";
import type { Doc } from "../../../convex/_generated/dataModel";

type Book = Doc<"books">;

interface BookListItemProps {
  book: Book;
  index: number;
  onEdit: (book: Book) => void;
  onDelete: (bookId: Book["_id"]) => void;
}

const BookListItem: React.FC<BookListItemProps> = ({
  book,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
        <CoverImage book={book} className="w-full h-full object-cover" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(book)}
            className="p-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg"
            title="Edit book"
            aria-label="Edit book"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="p-2 bg-error-500 hover:bg-error-600 text-white rounded-lg"
            title="Delete book"
            aria-label="Delete book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Rating badge */}
        {book.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1 bg-slate-900/50 rounded-full">
            <Star className="w-3 h-3 text-star fill-star" />
            <span className="text-white text-xs font-medium">
              {book.rating}
            </span>
          </div>
        )}
      </div>
      <BookMeta
        title={book.title}
        author={book.author}
        genre={book.genre}
      />
    </motion.div>
  );
};

export default BookListItem;
