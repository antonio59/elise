import { action } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Giphy search proxy - API key stays server-side (signed-in users only)
export const search = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
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
