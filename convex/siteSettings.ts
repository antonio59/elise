import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/crud";
import { siteSettingFields } from "./lib/validators";

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
    ...siteSettingFields,
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
