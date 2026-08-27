/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { parseGoogleBooksCoverUrl, extractIsbn } from "./lib/googleBooks";

type SearchResult = {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string;
  isbn?: string;
  pageCount: number;
  description: string;
  categories: string[];
};

async function searchGoogleBooks(
  query: string,
  apiKey: string | undefined,
): Promise<SearchResult[] | null> {
  const keyParam = apiKey ? `&key=${apiKey}` : "";
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8&orderBy=relevance${keyParam}`,
  );
  const data = await res.json();

  if (data.error) {
    console.error("Google Books API error:", data.error?.status || data.error);
    return null;
  }

  return (data.items ?? []).map((item: Record<string, any>) => {
    const imageLinks = item.volumeInfo?.imageLinks ?? {};
    const coverUrl = parseGoogleBooksCoverUrl(imageLinks);
    const isbn = extractIsbn(item.volumeInfo ?? {});

    return {
      id: item.id as string,
      title: (item.volumeInfo?.title as string) || "Unknown Title",
      authors: (item.volumeInfo?.authors as string[]) ?? [],
      coverUrl,
      isbn,
      pageCount: (item.volumeInfo?.pageCount as number) ?? 0,
      description: (item.volumeInfo?.description as string) ?? "",
      categories: (item.volumeInfo?.categories as string[]) ?? [],
    };
  });
}

/** Fallback when Google Books quota/key fails. Open Library is free and reliable. */
async function searchOpenLibrary(query: string): Promise<SearchResult[]> {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8&fields=key,title,author_name,cover_i,isbn,number_of_pages_median,subject,first_sentence`,
  );
  if (!res.ok) {
    console.error("Open Library search failed:", res.status);
    return [];
  }
  const data = await res.json();

  return (data.docs ?? []).map(
    (
      doc: {
        key?: string;
        title?: string;
        author_name?: string[];
        cover_i?: number;
        isbn?: string[];
        number_of_pages_median?: number;
        subject?: string[];
        first_sentence?: string[] | string;
      },
      index: number,
    ) => {
      const firstSentence = Array.isArray(doc.first_sentence)
        ? doc.first_sentence[0]
        : doc.first_sentence;
      return {
        id: doc.key || `ol-${index}-${doc.title ?? "book"}`,
        title: doc.title || "Unknown Title",
        authors: doc.author_name ?? [],
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : "",
        isbn: doc.isbn?.[0],
        pageCount: doc.number_of_pages_median ?? 0,
        description: firstSentence ?? "",
        categories: (doc.subject ?? []).slice(0, 5),
      };
    },
  );
}

// Search Google Books API (falls back to Open Library on quota/errors)
export const search = action({
  args: { query: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = (
      globalThis as unknown as {
        process?: { env: Record<string, string | undefined> };
      }
    ).process?.env?.GOOGLE_BOOKS_API_KEY;

    const google = await searchGoogleBooks(args.query, apiKey);
    if (google && google.length > 0) {
      return google;
    }

    // Empty Google result with a working API can be real; only fall back when
    // Google errored (null) or returned nothing after a likely quota/key miss.
    if (google === null || !apiKey) {
      return await searchOpenLibrary(args.query);
    }

    return google;
  },
});
