import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/crud";

// Get site settings (public)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    return (
      settings ?? {
        siteName: "Elise Reads",
        heroTitle: "Elise Reads",
        heroSubtitle: "books I've read, art I make, and words I write",
        heroDescription: "",
        footerTagline: "books I've read, art I make, and words I write",
        footerNote: "Made with love for Elise 💜",
      }
    );
  },
});

// Update site settings (admin only)
export const update = mutation({
  args: {
    siteName: v.optional(v.string()),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    footerTagline: v.optional(v.string()),
    footerNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});
