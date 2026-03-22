import React, { useState } from "react";
import { getCoverUrl } from "../utils/cover";

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

function titleToGradient(title: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getOpenLibraryUrl(title: string): string {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-M.jpg?default=false`;
}

const CoverImage: React.FC<CoverImageProps> = ({ book, className = "", alt }) => {
  const title = book.title || "Untitled";
  const author = book.author || "";

  // Priority: Convex storage > Open Library by title > title card
  const convexUrl = book.coverStorageId
    ? `https://agile-shrimp-456.convex.cloud/api/storage/${book.coverStorageId}`
    : undefined;
  const openLibraryUrl = title !== "Untitled" ? getOpenLibraryUrl(title) : undefined;

  const [src, setSrc] = useState(convexUrl || openLibraryUrl);
  const [showCard, setShowCard] = useState(!convexUrl && !openLibraryUrl);

  if (showCard || !src) {
    const [from, to] = titleToGradient(title);
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

  const tryFallback = () => {
    // If Convex storage failed, try Open Library
    if (convexUrl && src === convexUrl && openLibraryUrl) {
      setSrc(openLibraryUrl);
    } else {
      setShowCard(true);
    }
  };

  return (
    <img
      src={src}
      alt={alt || title}
      className={className}
      onError={tryFallback}
    />
  );
};

export default CoverImage;
