const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
export const CONVEX_DEPLOYMENT = convexUrl
  ? convexUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
  : "agile-shrimp-456.convex.cloud";

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
