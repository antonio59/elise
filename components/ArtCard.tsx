"use client";

import { motion } from "framer-motion";
import { cardHover, badgePop } from "@/lib/motion";

type ArtCardProps = {
  title: string;
  imageUrl: string;
  style?: string;
  onClick?: () => void;
  isNew?: boolean;
  index?: number;
};

export default function ArtCard({
  title,
  imageUrl,
  style,
  onClick,
  isNew,
  index = 0,
}: ArtCardProps) {
  return (
    <motion.div
      className="group cursor-pointer"
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
    >
      {/* Image - Portrait style */}
      <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-800">
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
        />

        {/* New badge */}
        {isNew && (
          <motion.span
            className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded"
            variants={badgePop}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            NEW
          </motion.span>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Style tag on image */}
        {style && (
          <motion.span
            className="absolute bottom-2 left-2 text-[11px] text-white/90 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            {style}
          </motion.span>
        )}
      </div>

      {/* Title */}
      <div className="mt-2 px-0.5">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}

export function ArtCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-[3/4] bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse" />
      <div className="mt-2 px-0.5">
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
      </div>
    </motion.div>
  );
}
