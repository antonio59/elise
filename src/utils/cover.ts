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
    return book.coverUrl.replace(/&amp;/g, "&");
  }
  return undefined;
}
