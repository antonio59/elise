import { useState } from "react";
import { getCoverUrl, getFallbackCoverUrl } from "./cover";

export function useCoverUrl(book: {
  coverStorageId?: string;
  coverUrl?: string;
  title?: string;
  isbn?: string;
}) {
  const [usedFallback, setUsedFallback] = useState(false);

  const primaryUrl = getCoverUrl(book);
  const fallbackUrl = getFallbackCoverUrl(book);

  const src = usedFallback ? fallbackUrl : primaryUrl;

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!usedFallback && fallbackUrl) {
      setUsedFallback(true);
    } else {
      // Hide the broken image
      (e.target as HTMLImageElement).style.display = "none";
    }
  };

  return { src, onError, hasCover: !!src };
}
