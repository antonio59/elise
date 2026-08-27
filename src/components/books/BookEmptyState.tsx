import React from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "../ui/Button";

interface BookEmptyStateProps {
  searchQuery: string;
  activeTab: string;
  onAddBook?: () => void;
}

const BookEmptyState: React.FC<BookEmptyStateProps> = ({
  searchQuery,
  activeTab,
  onAddBook,
}) => {
  return (
    <div className="col-span-full text-center py-12 px-4">
      <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-700 font-medium mb-1">
        {searchQuery
          ? "No books match your search"
          : `Nothing in ${activeTab} yet`}
      </p>
      {!searchQuery && (
        <p className="text-slate-500 text-sm mb-5">
          Add your first book and start filling this shelf.
        </p>
      )}
      {onAddBook && !searchQuery && (
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onAddBook}
          className="min-h-11"
        >
          Add a book
        </Button>
      )}
    </div>
  );
};

export default BookEmptyState;
