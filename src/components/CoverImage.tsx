import React, { useState } from "react";
import { getCoverUrl, getFallbackCoverUrl } from "../utils/cover";

interface CoverImageProps {
  book: { coverStorageId?: string; coverUrl?: string; title?: string; author?: string };
  className?: string;
  alt?: string;
}

// Generate a consistent gradient from title string using inline styles
// (dynamic Tailwind classes don't work at runtime)
const GRADIENTS: [string, string][] = [
  ["#f472b6", "#ec4899"],   // rose-400 → pink-500
  ["#a78bfa", "#a855f7"],   // violet-400 → purple-500
  ["#38bdf8", "#3b82f6"],   // sky-400 → blue-500
  ["#34d399", "#14b8a6"],   // emerald-400 → teal-500
  ["#fbbf24", "#f97316"],   // amber-400 → orange-500
  ["#e879f9", "#ec4899"],   // fuchsia-400 → pink-500
  ["#818cf8", "#a78bfa"],   // indigo-400 → violet-500
  ["#22d3ee", "#38bdf8"],   // cyan-400 → sky-500
  ["#f87171", "#fb7185"],   // red-400 → rose-500
  ["#a3e635", "#22c55e"],   // lime-400 → green-500
];

function titleToGradient(title: string): { from: string; to: string } {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [from, to] = GRADIENTS[Math.abs(hash) % GRADIENTS.length];
  return { from, to };
}

const CoverImage: React.FC<CoverImageProps> = ({ book, className = "", alt }) => {
  const primaryUrl = getCoverUrl(book);
  const fallbackUrl = getFallbackCoverUrl(book);
  const [attempt, setAttempt] = useState<"primary" | "fallback" | "failed">(
    primaryUrl ? "primary" : fallbackUrl ? "fallback" : "failed"
  );

  const currentSrc = attempt === "primary" ? primaryUrl : attempt === "fallback" ? fallbackUrl : undefined;

  const handleError = () => {
    if (attempt === "primary" && fallbackUrl) {
      setAttempt("fallback");
    } else {
      setAttempt("failed");
    }
  };

  // No cover available — show title card with inline gradient
  if (!currentSrc) {
    const title = book.title || "Untitled";
    const author = book.author || "";
    const { from, to } = titleToGradient(title);

    return (
      <div
        style={{ background: `linear-gradient(to bottom right, ${from}, ${to})` }}
        className={`flex flex-col items-center justify-center p-3 text-center ${className}`}
      >
        <p className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-4 drop-shadow-sm">
          {title}
        </p>
        {author && (
          <p className="text-white/70 text-[9px] sm:text-[10px] mt-1 line-clamp-1">{author}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || book.title || "Book cover"}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default CoverImage;
