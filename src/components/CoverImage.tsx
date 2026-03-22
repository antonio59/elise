import React, { useState, useRef, useEffect, useCallback } from "react";
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

function isBlankImage(img: HTMLImageElement): boolean {
  // naturalWidth/naturalHeight of 0 or 1 means blank/1px placeholder
  // Some Google Books zoom=2 URLs return tiny blank images
  return img.naturalWidth <= 1 || img.naturalHeight <= 1;
}

const CoverImage: React.FC<CoverImageProps> = ({ book, className = "", alt }) => {
  const primaryUrl = getCoverUrl(book);
  const fallbackUrl = getFallbackCoverUrl(book);
  const [attempt, setAttempt] = useState<"primary" | "fallback" | "failed">(
    primaryUrl ? "primary" : fallbackUrl ? "fallback" : "failed"
  );
  const imgRef = useRef<HTMLImageElement>(null);

  const currentSrc = attempt === "primary" ? primaryUrl : attempt === "fallback" ? fallbackUrl : undefined;

  const advanceAttempt = useCallback(() => {
    if (attempt === "primary" && fallbackUrl) {
      setAttempt("fallback");
    } else {
      setAttempt("failed");
    }
  }, [attempt, fallbackUrl]);

  const handleError = useCallback(() => {
    advanceAttempt();
  }, [advanceAttempt]);

  // Check for blank images on load (Google Books zoom=2 returns blank 200s)
  const handleLoad = useCallback(() => {
    if (imgRef.current && isBlankImage(imgRef.current)) {
      advanceAttempt();
    }
  }, [advanceAttempt]);

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
      ref={imgRef}
      src={currentSrc}
      alt={alt || book.title || "Book cover"}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};

export default CoverImage;
