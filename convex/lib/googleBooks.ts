/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GoogleBooksImageLinks {
  extraLarge?: string;
  large?: string;
  medium?: string;
  thumbnail?: string;
  smallThumbnail?: string;
}

export interface GoogleBooksVolumeInfo {
  title?: string;
  authors?: string[];
  pageCount?: number;
  description?: string;
  categories?: string[];
  imageLinks?: GoogleBooksImageLinks;
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
}

export interface GoogleBooksItem {
  id: string;
  volumeInfo?: GoogleBooksVolumeInfo;
}

export function parseGoogleBooksCoverUrl(
  imageLinks: GoogleBooksImageLinks | Record<string, any>,
): string {
  const rawCoverUrl = (
    (imageLinks.extraLarge as string | undefined) ??
    (imageLinks.large as string | undefined) ??
    (imageLinks.medium as string | undefined) ??
    (imageLinks.thumbnail as string | undefined) ??
    (imageLinks.smallThumbnail as string | undefined) ??
    ""
  ).replace("http://", "https://");

  let coverUrl = rawCoverUrl;
  try {
    if (rawCoverUrl) {
      const u = new URL(rawCoverUrl);
      if (
        u.hostname === "books.google.com" ||
        u.hostname.endsWith(".books.google.com")
      ) {
        u.searchParams.set("zoom", "3");
        coverUrl = u.toString();
      }
    }
  } catch {
    /* leave as-is */
  }

  return coverUrl;
}

export function extractIsbn(
  volumeInfo: GoogleBooksVolumeInfo | Record<string, any>,
): string | undefined {
  const identifiers: Array<{ type: string; identifier: string }> =
    volumeInfo.industryIdentifiers ?? [];
  return (
    identifiers.find((id) => id.type === "ISBN_13")?.identifier ??
    identifiers.find((id) => id.type === "ISBN_10")?.identifier
  );
}
