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

// Check if a loaded image is blank/tiny by sampling pixels via canvas
function isUsableImage(img: HTMLImageElement): boolean {
  if (img.naturalWidth < 10 || img.naturalHeight < 10) return false;
  try {
    const canvas = document.createElement("canvas");
    const size = Math.min(img.naturalWidth, img.naturalHeight, 50);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return true; // Can't check, assume ok
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    // Check first ~100 pixels for any non-white content
    let coloredPixels = 0;
    const pixelCount = Math.min(size * size, 100);
    for (let i = 0; i < pixelCount * 4; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      // Not white, not transparent, not very light grey
      if (a > 10 && (r < 245 || g < 245 || b < 245)) {
        coloredPixels++;
      }
    }
    return coloredPixels > 5; // Need at least 5 colored pixels out of 100
  } catch {
    // Canvas tainted or other error — assume image is fine
    return true;
  }
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

  const handleError = useCallback(() => {
    advanceAttempt();
  }, [advanceAttempt]);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!isUsableImage(e.currentTarget)) {
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
