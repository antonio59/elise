/**
 * Client-side mirror of cover URL sharpening (keep in sync with convex/lib/coverUrl.ts).
 */

function isGoogleBooksHost(hostname: string): boolean {
  return (
    hostname === "books.google.com" ||
    hostname.endsWith(".books.google.com")
  );
}

export function upgradeGoogleCoverUrl(url: string, width = 800): string {
  const cleaned = url.replace(/&amp;/g, "&").replace(/^http:\/\//i, "https://");
  try {
    const u = new URL(cleaned);
    if (!isGoogleBooksHost(u.hostname)) return cleaned;
    u.searchParams.delete("edge");
    u.searchParams.delete("pg");
    u.searchParams.set("zoom", "3");
    u.searchParams.set("fife", `w${width}`);
    return u.toString();
  } catch {
    return cleaned;
  }
}

/** Google “image not available” placeholder when upscaled via fife=w800. */
const GOOGLE_UNAVAILABLE_PLACEHOLDER = {
  width: 800,
  height: 1043,
} as const;

export function isGoogleUnavailableSize(
  width: number,
  height: number,
): boolean {
  return (
    width === GOOGLE_UNAVAILABLE_PLACEHOLDER.width &&
    height === GOOGLE_UNAVAILABLE_PLACEHOLDER.height
  );
}

/**
 * Google’s gray “image not available” PNG keeps ~0.767 aspect at any fife
 * size (800×1043, 400×522, 200×261…). Real book covers are almost never
 * that wide, so matching the ratio catches the placeholder at any scale.
 */
export const GOOGLE_PLACEHOLDER_RATIO =
  GOOGLE_UNAVAILABLE_PLACEHOLDER.width / GOOGLE_UNAVAILABLE_PLACEHOLDER.height;

export function looksLikeGooglePlaceholder(
  width: number,
  height: number,
): boolean {
  if (width <= 0 || height <= 0) return false;
  if (isGoogleUnavailableSize(width, height)) return true;
  return Math.abs(width / height - GOOGLE_PLACEHOLDER_RATIO) < 0.008;
}
