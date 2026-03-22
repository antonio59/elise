// Get the best cover URL for a book
// Prefers Convex storage (permanent) over Google Books URL (expires)
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
    // Upgrade Google Books thumbnail resolution for sharper covers
    url = url.replace(/zoom=[0-9]/, "zoom=2");
    return url;
  }
  return undefined;
}
