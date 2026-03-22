import React, { useState } from "react";
import { getCoverUrl, getFallbackCoverUrl } from "../utils/cover";
import { BookOpen } from "lucide-react";

interface CoverImageProps {
  book: { coverStorageId?: string; coverUrl?: string; title?: string };
  className?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

const CoverImage: React.FC<CoverImageProps> = ({
  book,
  className = "",
  alt,
  fallback,
}) => {
  const primaryUrl = getCoverUrl(book);
  const fallbackUrl = getFallbackCoverUrl(book);
  const [currentSrc, setCurrentSrc] = useState(primaryUrl);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (!hasErrored && fallbackUrl) {
      setHasErrored(true);
      setCurrentSrc(fallbackUrl);
    } else if (!hasErrored) {
      setHasErrored(true);
      setCurrentSrc(undefined);
    }
  };

  if (!currentSrc) {
    return (
      fallback || (
        <div className={`flex items-center justify-center bg-gradient-to-br from-primary-100 to-violet-100 ${className}`}>
          <BookOpen className="w-8 h-8 text-primary-300" />
        </div>
      )
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
