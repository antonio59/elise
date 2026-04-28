import React from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const ReviewEmptyState: React.FC = () => {
  return (
    <div className="card p-12 text-center">
      <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-600 mb-2">
        No reviews yet
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        Add ratings and reviews to your books in the Dashboard to see them here.
      </p>
      <Link to="/dashboard/books" className="btn btn-primary text-sm">
        <BookOpen className="w-4 h-4" />
        Go to My Books
      </Link>
    </div>
  );
};

export default ReviewEmptyState;
