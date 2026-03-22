import React, { useState } from "react";
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

function titleToGradient(title: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

const CoverImage: React.FC<CoverImageProps> = ({ book, className = "", alt }) => {
  const title = book.title || "Untitled";
  const author = book.author || "";
  const primaryUrl = getCoverUrl(book);
  const fallbackUrl = getFallbackCoverUrl(book);

  const [src, setSrc] = useState(primaryUrl);
  const [showCard, setShowCard] = useState(!primaryUrl);

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
    if (fallbackUrl && src !== fallbackUrl) {
      setSrc(fallbackUrl);
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
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth < 100) {
          tryFallback();
        }
      }}
    />
  );
};

export default CoverImage;
// force rebuild 1774194664
