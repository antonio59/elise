import React from "react";
import { Loader2, Star, AlertCircle, Plus, CheckCircle2, BookMarked, Heart } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

interface BookFormFooterProps {
  destination: "read" | "reading" | "wishlist";
  onDestinationChange: (dest: "read" | "reading" | "wishlist") => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  error?: string | null;
  duplicateInfo?: { id: Id<"books">; currentStatus: string } | null;
  onMoveBook?: () => void;
  onClearDuplicate?: () => void;
  saving: boolean;
  canSubmit: boolean;
  submitLabel?: string;
  getStatusLabel?: (status: string) => string;
  label?: string;
  submitIcon?: React.ReactNode;
}

const destinations = [
  { key: "read" as const, label: "Finished", icon: CheckCircle2, color: "bg-success-500" },
  { key: "reading" as const, label: "Reading", icon: BookMarked, color: "bg-accent-500" },
  { key: "wishlist" as const, label: "Wishlist", icon: Heart, color: "bg-primary-500" },
];

const BookFormFooter: React.FC<BookFormFooterProps> = ({
  destination,
  onDestinationChange,
  rating,
  onRatingChange,
  error = null,
  duplicateInfo,
  onMoveBook,
  onClearDuplicate,
  saving,
  canSubmit,
  submitLabel = "Add Book",
  getStatusLabel = () => "",
  label = "Where does this go?",
  submitIcon = <Plus className="w-5 h-5" />,
}) => {
  return (
    <>
      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {destinations.map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.key}
                type="button"
                onClick={() => onDestinationChange(dest.key)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  destination === dest.key
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${destination === dest.key ? "text-primary-600" : "text-slate-400"}`}
                />
                <span
                  className={`text-sm font-medium ${destination === dest.key ? "text-primary-600" : "text-slate-600"}`}
                >
                  {dest.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating (only for finished) */}
      {destination === "read" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={star <= rating}
                className="p-1 focus:outline-none focus:ring-2 focus:ring-star rounded"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? "text-star fill-star"
                      : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Duplicate found */}
      {duplicateInfo && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">
                This book is {getStatusLabel(duplicateInfo.currentStatus)}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Would you like to move it to {getStatusLabel(destination)}{" "}
                instead?
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={onMoveBook}
                  disabled={saving}
                  className="btn btn-primary text-sm py-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Yes, move it</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClearDuplicate}
                  className="btn btn-secondary text-sm py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={saving || !canSubmit || !!duplicateInfo}
        className="btn btn-primary w-full"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            {submitIcon}
            {submitLabel}
          </>
        )}
      </button>
    </>
  );
};

export default BookFormFooter;
