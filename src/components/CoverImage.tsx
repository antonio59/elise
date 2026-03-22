import React, { useState } from "react";
import { getCoverUrl, getFallbackCoverUrl } from "../utils/cover";

interface CoverImageProps {
  book: { coverStorageId?: string; coverUrl?: string; title?: string; author?: string };
  className?: string;
  alt?: string;
}

// Generate a consistent gradient from title string
function titleToGradient(title: string): string {
  const gradients = [
    "from-rose-400 to-pink-500",
    "from-violet-400 to-purple-500",
    "from-sky-400 to-blue-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
    "from-fuchsia-400 to-pink-500",
    "from-indigo-400 to-violet-500",
    "from-cyan-400 to-sky-500",
    "from-red-400 to-rose-500",
    "from-lime-400 to-green-500",
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

const CoverImage: React.FC<CoverImageProps> = ({ book, className = "", alt }) => {
  const primaryUrl = getCoverUrl(book);
  const fallbackUrl = getFallbackCoverUrl(book);
  const [currentSrc, setCurrentSrc] = useState(primaryUrl);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (!hasErrored && fallbackUrl && currentSrc !== fallbackUrl) {
      setHasErrored(true);
      setCurrentSrc(fallbackUrl);
    } else {
      setHasErrored(true);
      setCurrentSrc(undefined);
    }
  };

  // No cover available — show title card
  if (!currentSrc || hasErrored && !currentSrc) {
    const title = book.title || "Untitled";
    const author = book.author || "";
    const gradient = titleToGradient(title);

    return (
      <div
        className={`bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-3 text-center ${className}`}
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
