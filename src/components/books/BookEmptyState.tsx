import React from "react";
import { BookOpen } from "lucide-react";

interface BookEmptyStateProps {
  searchQuery: string;
  activeTab: string;
}

const BookEmptyState: React.FC<BookEmptyStateProps> = ({
  searchQuery,
  activeTab,
}) => {
  return (
    <div className="col-span-full text-center py-12">
      <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500">
        {searchQuery
          ? "No books match your search"
          : `No books in ${activeTab} yet`}
      </p>
    </div>
  );
};

export default BookEmptyState;
