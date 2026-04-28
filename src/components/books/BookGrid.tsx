import React from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import BookListItem from "./BookListItem";
import BookEmptyState from "./BookEmptyState";

type Book = Doc<"books">;

interface BookGridProps {
  books: Book[];
  searchQuery: string;
  activeTab: string;
  onEdit: (book: Book) => void;
  onDelete: (bookId: Book["_id"]) => void;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  searchQuery,
  activeTab,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book: Book, index: number) => (
        <BookListItem
          key={book._id}
          book={book}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {books.length === 0 && (
        <BookEmptyState searchQuery={searchQuery} activeTab={activeTab} />
      )}
    </div>
  );
};

export default BookGrid;
