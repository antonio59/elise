import { query } from "./_generated/server";
import { v } from "convex/values";

// Giphy search proxy — API key stays server-side
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const apiKey = (
      globalThis as unknown as {
        process?: { env: Record<string, string | undefined> };
      }
    ).process?.env?.GIPHY_API_KEY;
    if (!apiKey) {
      console.error("GIPHY_API_KEY not set");
      return [];
    }

    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(args.query)}&limit=${args.limit ?? 12}&rating=g`,
      );
      const data = await res.json();

      return (data.data || []).map(
        (gif: {
          id: string;
          images: {
            original: { url: string };
            fixed_height_small: { url: string };
          };
        }) => ({
          id: gif.id,
          url: gif.images.original.url,
          preview: gif.images.fixed_height_small.url,
        }),
      );
    } catch (err) {
      console.error("Giphy search failed:", err);
      return [];
    }
  },
});
