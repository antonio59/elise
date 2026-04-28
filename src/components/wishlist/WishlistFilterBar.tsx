import React from "react";
import { BookOpen, MessageSquarePlus, Share2, Check } from "lucide-react";

interface WishlistFilterBarProps {
  bookCount: number;
  totalPages: number;
  onSuggestClick: () => void;
  onShare: () => void;
  shareStatus: "idle" | "copied";
}

const WishlistFilterBar: React.FC<WishlistFilterBarProps> = ({
  bookCount,
  totalPages,
  onSuggestClick,
  onShare,
  shareStatus,
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm border border-slate-200">
        <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          {bookCount}
        </span>
        <span className="text-sm text-slate-500">books</span>
      </div>
      {totalPages > 0 && (
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <BookOpen className="w-4 h-4 text-primary-500" />
          <span className="text-lg font-bold text-primary-600">
            {totalPages.toLocaleString()}
          </span>
          <span className="text-sm text-slate-500">pages</span>
        </div>
      )}
      <button onClick={onSuggestClick} className="btn btn-gradient">
        <MessageSquarePlus className="w-5 h-5" />
        Suggest a Book
      </button>
      <button
        onClick={onShare}
        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 font-medium rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
      >
        {shareStatus === "copied" ? (
          <>
            <Check className="w-4 h-4 text-success-500" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Share
          </>
        )}
      </button>
    </div>
  );
};

export default WishlistFilterBar;
