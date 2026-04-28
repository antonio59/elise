/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { parseGoogleBooksCoverUrl, extractIsbn } from "./lib/googleBooks";

// Search Google Books API
export const search = action({
  args: { query: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = (
      globalThis as unknown as {
        process?: { env: Record<string, string | undefined> };
      }
    ).process?.env?.GOOGLE_BOOKS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(args.query)}&maxResults=8&orderBy=relevance${keyParam}`,
    );
    const data = await res.json();

    if (data.error) {
      console.error("Google Books API error:", data.error);
      return [];
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
  },
});
