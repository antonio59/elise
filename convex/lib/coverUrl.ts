/**
 * Shared helpers for sharpening Google Books cover URLs.
 * Low zoom thumbnails (~128px) look blurry when stretched in the UI —
 * prefer fife=w800 (or higher) so we store and display crisp covers.
 */

export function isGoogleBooksHost(hostname: string): boolean {
  return (
    hostname === "books.google.com" ||
    hostname.endsWith(".books.google.com")
  );
}

/** Extract volume id from a Google Books cover/content URL when present. */
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

/**
 * Upgrade a cover URL to a sharp display size.
 * Uses Google’s undocumented but widely used `fife=wN` size hint.
 */
export function upgradeGoogleCoverUrl(
  url: string,
  width = 800,
): string {
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

/** Candidate URLs from largest → smaller for fetch/store pipelines. */
export function googleCoverCandidates(coverUrl: string): string[] {
  const cleaned = coverUrl.replace(/&amp;/g, "&").replace(/^http:\/\//i, "https://");
  const volumeId = extractGoogleVolumeId(cleaned);
  const urls: string[] = [];

  if (volumeId) {
    urls.push(
      `https://books.google.com/books/publisher/content/images/frontcover/${volumeId}?fife=w800-h1200&source=gbs_api`,
      `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&zoom=3&source=gbs_api&fife=w800`,
    );
  }

  urls.push(
    upgradeGoogleCoverUrl(cleaned, 800),
    upgradeGoogleCoverUrl(cleaned, 400),
  );

  // Deduplicate while preserving order
  return [...new Set(urls)];
}
