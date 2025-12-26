"use client";

import Link from "next/link";

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
  isNew?: boolean;
  views?: number;
};

export default function BookCard(props: BookCardProps) {
  const {
    title,
    author,
    coverUrl,
    rating = 0,
    genre,
    status,
    isFavorite,
    href,
    onClick,
    isNew,
    views,
  } = props;

  const cardContent = (
    <div className="group cursor-pointer">
      {/* Cover Image - Tall poster style like Webtoons */}
      <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-800">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900">
            <span className="text-4xl opacity-40">📖</span>
          </div>
        )}

        {/* Status Badges - Top left like Webtoons */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
              NEW
            </span>
          )}
          {status === "reading" && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded">
              UP
            </span>
          )}
        </div>

        {/* Favorite indicator */}
        {isFavorite && (
          <div className="absolute top-2 right-2">
            <span className="text-amber-400 drop-shadow-md">★</span>
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Genre tag on image */}
        {genre && (
          <span className="absolute bottom-2 left-2 text-[11px] text-white/90 font-medium">
            {genre}
          </span>
        )}
      </div>

      {/* Content - Minimal like Webtoons */}
      <div className="mt-2 px-0.5">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
          {author}
        </p>

        {/* Rating or Views - subtle stats */}
        <div className="flex items-center gap-2 mt-1">
          {rating > 0 && (
            <div className="flex items-center gap-0.5">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
          {views !== undefined && views > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatViews(views)} views
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block" onClick={onClick}>
        {cardContent}
      </Link>
    );
  }

  return <div onClick={onClick}>{cardContent}</div>;
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  return views.toString();
}

export function BookCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse" />
      <div className="mt-2 px-0.5 space-y-1.5">
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}
