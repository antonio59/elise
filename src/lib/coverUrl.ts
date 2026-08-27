/**
 * Client-side mirror of cover URL sharpening (keep in sync with convex/lib/coverUrl.ts).
 */

export function isGoogleBooksHost(hostname: string): boolean {
  return (
    hostname === "books.google.com" ||
    hostname.endsWith(".books.google.com")
  );
}

export function extractGoogleVolumeId(url: string): string | undefined {
  try {
    const u = new URL(url.replace(/&amp;/g, "&"));
    const fromQuery = u.searchParams.get("id");
    if (fromQuery) return fromQuery;
    const match = u.pathname.match(/\/(?:books|volumes)\/([^/?]+)/);
    return match?.[1];
  } catch {
    return undefined;
  }
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
export const GOOGLE_UNAVAILABLE_PLACEHOLDER = {
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

export function googleCoverCandidates(coverUrl: string): string[] {
  const cleaned = coverUrl
    .replace(/&amp;/g, "&")
    .replace(/^http:\/\//i, "https://");
  const volumeId = extractGoogleVolumeId(cleaned);
  const urls: string[] = [];
  if (volumeId) {
    urls.push(
      `https://books.google.com/books/publisher/content/images/frontcover/${volumeId}?fife=w800-h1200&source=gbs_api`,
    );
  }
  urls.push(upgradeGoogleCoverUrl(cleaned, 400));
  return [...new Set(urls)];
}
