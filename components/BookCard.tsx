"use client";

import Link from "next/link";
import Badge from "./ui/Badge";

type BookCardProps = {
  title: string;
  author: string;
  coverUrl?: string | null;
  rating?: number;
  review?: string;
  progress?: number;
  genre?: string | null;
  status?: "reading" | "read" | "wishlist";
  isFavorite?: boolean;
  href?: string;
  onClick?: () => void;
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-amber-400" : "text-gray-300 dark:text-neutral-600"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function BookCard(props: BookCardProps) {
  const {
    title,
    author,
    coverUrl,
    rating = 0,
    review,
    progress,
    genre,
    status,
    isFavorite,
    href,
    onClick,
  } = props;

  const computedProgress =
    progress ?? (status === "read" ? 100 : progressFromStatus(status));

  const statusBadge = () => {
    if (!status) return null;
    const config = {
      read: { label: "✓ Read", variant: "success" as const },
      reading: { label: "Reading", variant: "info" as const },
      wishlist: { label: "Wishlist", variant: "purple" as const },
    };
    return config[status];
  };

  const badge = statusBadge();

  const cardContent = (
    <div className="group h-full bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      {/* Cover Image */}
      <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 relative">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-50">📚</span>
          </div>
        )}

        {/* Favorite Star */}
        {isFavorite && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-neutral-900/90 rounded-full flex items-center justify-center shadow-md">
            <span className="text-amber-400">⭐</span>
          </div>
        )}

        {/* Progress Overlay */}
        {computedProgress !== undefined &&
          computedProgress > 0 &&
          computedProgress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                    style={{ width: `${computedProgress}%` }}
                  />
                </div>
                <span className="text-xs text-white font-medium">
                  {computedProgress}%
                </span>
              </div>
            </div>
          )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {author}
            </p>
          </div>
          {genre && <Badge variant="pink">{genre}</Badge>}
        </div>

        {/* Status Badge */}
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}

        {/* Rating */}
        {rating > 0 && (
          <div className="pt-1">
            <StarRating rating={rating} />
          </div>
        )}

        {/* Review Snippet */}
        {review && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2 pt-1">
            &ldquo;{review}&rdquo;
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full" onClick={onClick}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="h-full" onClick={onClick}>
      {cardContent}
    </div>
  );
}

function progressFromStatus(status?: "reading" | "read" | "wishlist") {
  if (status === "read") return 100;
  if (status === "reading") return 40;
  return 0;
}

export function BookCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
      <div className="aspect-[2/3] bg-gray-200 dark:bg-neutral-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-full mt-3" />
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-full" />
      </div>
    </div>
  );
}
