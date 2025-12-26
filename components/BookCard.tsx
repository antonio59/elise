"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cardHover, badgePop, imageReveal } from "@/lib/motion";

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
  index?: number;
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
    index = 0,
  } = props;

  const cardContent = (
    <motion.div
      className="group cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
    >
      {/* Cover Image - Tall poster style like Webtoons */}
      <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-800">
        {coverUrl ? (
          <motion.img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          />
        ) : (
          <motion.div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-4xl opacity-40">📖</span>
          </motion.div>
        )}

        {/* Status Badges - Top left like Webtoons */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <motion.span
              className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded"
              variants={badgePop}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              NEW
            </motion.span>
          )}
          {status === "reading" && (
            <motion.span
              className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded"
              variants={badgePop}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              UP
            </motion.span>
          )}
        </div>

        {/* Favorite indicator */}
        {isFavorite && (
          <motion.div
            className="absolute top-2 right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.2,
            }}
          >
            <span className="text-amber-400 drop-shadow-md">★</span>
          </motion.div>
        )}

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Genre tag on image */}
        {genre && (
          <motion.span
            className="absolute bottom-2 left-2 text-[11px] text-white/90 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            {genre}
          </motion.span>
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
              <motion.span
                className="text-amber-400 text-xs"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                ★
              </motion.span>
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
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-[3/4] bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse" />
      <div className="mt-2 px-0.5 space-y-1.5">
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-1/2" />
      </div>
    </motion.div>
  );
}
