import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  size?: "sm" | "md";
  showLabel?: boolean;
  labels?: Record<number, string>;
}

const DEFAULT_LABELS: Record<number, string> = {
  1: "not it",
  2: "meh",
  3: "solid read",
  4: "obsessed",
  5: "all-time fav",
};

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = "sm",
  showLabel = false,
  labels = DEFAULT_LABELS,
}) => {
  const starClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const labelMargin = size === "sm" ? "ml-1" : "ml-2";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starClass} ${
            i < (rating ?? 0) ? "text-star fill-star" : "text-slate-200"
          }`}
        />
      ))}
      {showLabel && rating && rating > 0 && (
        <span className={`${labelMargin} text-xs text-primary-500 font-medium`}>
          {labels[rating] ?? ""}
        </span>
      )}
    </div>
  );
};

export default StarRating;
