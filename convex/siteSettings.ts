import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { sanitizeOptionalUrl, sanitizePlainText } from "./utils";

async function requireSession(ctx: any, token: string) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Not authenticated");
  }

  return session;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    if (!settings) {
      return {
        heroTitle: "My Reading",
        heroSubtitle: "Adventures",
        heroDescription: "I'm collecting all the magical worlds I've visited and the stories that made me smile. Take a look around!",
        heroImageUrl: null,
        siteName: "Niece's World",
      };
    }
    return settings;
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    heroImageUrl: v.optional(v.string()),
    heroImageStorageId: v.optional(v.id("_storage")),
    siteName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    const existing = await ctx.db.query("siteSettings").first();

    const updates = {
      heroTitle: sanitizePlainText(args.heroTitle, 120),
      heroSubtitle: sanitizePlainText(args.heroSubtitle, 120),
      heroDescription: sanitizePlainText(args.heroDescription, 800),
      heroImageUrl: sanitizeOptionalUrl(args.heroImageUrl),
      heroImageStorageId: args.heroImageStorageId,
      siteName: sanitizePlainText(args.siteName, 120),
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      return await ctx.db.insert("siteSettings", updates);
    }
  },
});

export const updateHeroImage = mutation({
  args: {
    token: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    
    const existing = await ctx.db.query("siteSettings").first();

    if (existing) {
      // Delete old image if exists
      if (existing.heroImageStorageId) {
        await ctx.storage.delete(existing.heroImageStorageId);
      }
      await ctx.db.patch(existing._id, {
        heroImageUrl: imageUrl || undefined,
        heroImageStorageId: args.storageId,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("siteSettings", {
        heroImageUrl: imageUrl || undefined,
        heroImageStorageId: args.storageId,
        updatedAt: Date.now(),
      });
    }
  },
});
