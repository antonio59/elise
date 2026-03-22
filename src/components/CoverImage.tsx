import React, { useState, useCallback } from "react";
import { getCoverUrl, getFallbackCoverUrl } from "../utils/cover";

interface CoverImageProps {
  book: { coverStorageId?: string; coverUrl?: string; title?: string; author?: string };
  className?: string;
  alt?: string;
}

const GRADIENTS: [string, string][] = [
  ["#f472b6", "#ec4899"],
  ["#a78bfa", "#a855f7"],
  ["#38bdf8", "#3b82f6"],
  ["#34d399", "#14b8a6"],
  ["#fbbf24", "#f97316"],
  ["#e879f9", "#ec4899"],
  ["#818cf8", "#a78bfa"],
  ["#22d3ee", "#38bdf8"],
  ["#f87171", "#fb7185"],
  ["#a3e635", "#22c55e"],
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

  const advanceAttempt = useCallback(() => {
    setAttempt((prev) => {
      if (prev === "primary" && fallbackUrl) return "fallback";
      return "failed";
    });
  }, [fallbackUrl]);

  // If image is suspiciously small (< 100px), it's a blank/placeholder — try next fallback
  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth < 100 || img.naturalHeight < 100) {
      advanceAttempt();
    }
  }, [advanceAttempt]);

  // Show title card as last resort
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
      onError={advanceAttempt}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};

export default CoverImage;
