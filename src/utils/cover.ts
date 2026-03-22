import type React from "react";
// Get the best cover URL for a book
// Prefers Convex storage (permanent) over Google Books URL (zoom=2)
const CONVEX_DEPLOYMENT = "agile-shrimp-456.convex.cloud";

export function getCoverUrl(book: {
  coverStorageId?: string;
  coverUrl?: string;
}): string | undefined {
  if (book.coverStorageId) {
    return `https://${CONVEX_DEPLOYMENT}/api/storage/${book.coverStorageId}`;
  }
  if (book.coverUrl) {
    let url = book.coverUrl.replace(/&amp;/g, "&");
    // Request higher resolution from Google Books
    url = url.replace(/zoom=[0-9]/, "zoom=2");
    return url;
  }
  return undefined;
}

// Fallback: zoom=1 for Google Books, or Open Library by title
export function getFallbackCoverUrl(book: {
  coverStorageId?: string;
  coverUrl?: string;
  title?: string;
  isbn?: string;
}): string | undefined {
  // Convex storage URLs always work — no fallback needed
  if (book.coverStorageId) return undefined;

  if (book.coverUrl) {
    const url = book.coverUrl.replace(/&amp;/g, "&");
    // First fallback: zoom=1 (original Google Books thumbnail)
    try {
      const hostname = new URL(url).hostname;
      if (hostname === "googleapis.com" || hostname.endsWith(".googleapis.com") ||
          hostname === "books.google.com" || hostname.endsWith(".google.com")) {
        return url.replace(/zoom=[0-9]/, "zoom=1");
      }
    } catch { /* not a valid URL */ }
    return url;
  }

  // Last resort: Open Library by title
  if (book.title) {
    const encoded = encodeURIComponent(book.title);
    return `https://covers.openlibrary.org/b/title/${encoded}-M.jpg?default=false`;
  }

  return undefined;
}

// Error handler for <img> tags — tries zoom=1 fallback, then hides
export function handleCoverError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  const src = img.src;
  // If zoom=2 failed, try zoom=1
  if (src.includes("zoom=2")) {
    img.src = src.replace("zoom=2", "zoom=1");
  } else {
    img.style.display = "none";
  }
}
