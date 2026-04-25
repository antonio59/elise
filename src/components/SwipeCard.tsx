import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { BookOpen, Heart, X, ChevronDown, ChevronUp } from "lucide-react";

interface BookCandidate {
  googleBookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
}

interface SwipeCardProps {
  book: BookCandidate;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 120;

const SwipeCard: React.FC<SwipeCardProps> = ({ book, onSwipe, isTop }) => {
  const [expanded, setExpanded] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  };

  // Strip HTML tags from description using DOMParser for safe sanitization
  const cleanDescription = book.description
    ? (() => {
        const doc = new DOMParser().parseFromString(book.description, "text/html");
        return doc.body.textContent || "";
      })()
    : "";

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? "z-10 cursor-grab active:cursor-grabbing" : "z-0"}`}
      style={isTop ? { x, rotate } : undefined}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      exit={{
        x: 300,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="w-full h-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Cover Image */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center"
          style={{ height: expanded ? "35%" : "55%" }}
        >
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-auto object-contain drop-shadow-lg"
              draggable={false}
            />
          ) : (
            <div className="w-32 h-48 rounded-lg bg-white/50 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-slate-300" />
            </div>
          )}

          {/* Swipe indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-success-500 text-white font-bold text-lg border-2 border-white shadow-lg -rotate-12"
                style={{ opacity: likeOpacity }}
              >
                WANT IT
              </motion.div>
              <motion.div
                className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-red-400 text-white font-bold text-lg border-2 border-white shadow-lg rotate-12"
                style={{ opacity: passOpacity }}
              >
                PASS
              </motion.div>
            </>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 p-5 flex flex-col min-h-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-slate-800 leading-tight truncate">
                {book.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1 truncate">{book.author}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {book.genre && book.genre !== "Other" && (
              <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                {book.genre}
              </span>
            )}
            {book.pageCount && book.pageCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                {book.pageCount} pages
              </span>
            )}
          </div>

          {/* Description (expandable) */}
          {cleanDescription && (
            <div className={`mt-3 overflow-y-auto ${expanded ? "flex-1" : "max-h-16"}`}>
              <p className={`text-sm text-slate-600 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
                {cleanDescription}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isTop && (
          <div className="flex items-center justify-center gap-6 p-4 border-t border-slate-100">
            <button
              onClick={() => onSwipe("left")}
              className="w-14 h-14 rounded-full bg-error-50 hover:bg-error-100 border-2 border-error-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6 text-error-400" />
            </button>
            <button
              onClick={() => onSwipe("right")}
              className="w-14 h-14 rounded-full bg-success-50 hover:bg-success-100 border-2 border-success-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Heart className="w-6 h-6 text-success-500" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;
