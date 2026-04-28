import {
  query,
  mutation,
  internalAction,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { auth } from "./auth";
import {
  requireAuth,
  requireOwnership,
  cleanupStorage,
  checkLikeRateLimit,
  filterUndefinedUpdates,
} from "./lib/crud";
import { Resend } from "resend";

// Get all published photos (for public gallery)
export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
    albumId: v.optional(v.id("photoAlbums")),
  },
  handler: async (ctx, args) => {
    if (args.albumId) {
      return await ctx.db
        .query("photos")
        .withIndex("by_album", (q) => q.eq("albumId", args.albumId))
        .order("desc")
        .take(args.limit ?? 1000);
    }

    return await ctx.db
      .query("photos")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(args.limit ?? 1000);
  },
});

// Get all photos for authenticated user
export const getMyPhotos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("photos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get photos by album
export const getByAlbum = query({
  args: { albumId: v.id("photoAlbums") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_album", (q) => q.eq("albumId", args.albumId))
      .order("desc")
      .collect();
  },
});

// Get single photo
export const getById = query({
  args: { id: v.id("photos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create photo (requires auth)
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    albumId: v.optional(v.id("photoAlbums")),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    return await ctx.db.insert("photos", {
      ...args,
      userId,
      likes: 0,
      createdAt: Date.now(),
    });
  },
});

// Update photo (requires auth)
export const update = mutation({
  args: {
    id: v.id("photos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    albumId: v.optional(v.id("photoAlbums")),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireOwnership(ctx, "photos", args.id);

    const { id, ...updates } = args;
    await ctx.db.patch(id, filterUndefinedUpdates(updates));
  },
});

// Delete photo (requires auth)
export const remove = mutation({
  args: { id: v.id("photos") },
  handler: async (ctx, args) => {
    const photo = await requireOwnership(ctx, "photos", args.id);
    await cleanupStorage(ctx, photo.storageId);
    await ctx.db.delete(args.id);
  },
});

// Like photo (public - no auth required)
export const like = mutation({
  args: { id: v.id("photos"), visitorId: v.string() },
  handler: async (ctx, args) => {
    await checkLikeRateLimit(ctx, args.visitorId, "likePhoto");

    const photo = await ctx.db.get(args.id);
    if (!photo) throw new Error("Photo not found");

    await ctx.db.patch(args.id, { likes: (photo.likes ?? 0) + 1 });
  },
});

// Get photo albums
export const getMyAlbums = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("photoAlbums")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get all published albums (public)
export const getAlbums = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("photoAlbums").order("desc").collect();
  },
});

// Create album (requires auth)
export const createAlbum = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    return await ctx.db.insert("photoAlbums", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

// Update album (requires auth)
export const updateAlbum = mutation({
  args: {
    id: v.id("photoAlbums"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireOwnership(ctx, "photoAlbums", args.id);

    const { id, ...updates } = args;
    await ctx.db.patch(id, filterUndefinedUpdates(updates));
  },
});

// Delete album (requires auth)
export const removeAlbum = mutation({
  args: { id: v.id("photoAlbums") },
  handler: async (ctx, args) => {
    await requireOwnership(ctx, "photoAlbums", args.id);
    await ctx.db.delete(args.id);
  },
});

// Get unique photo tags (for filtering)
export const getTags = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();

    const tagSet = new Set<string>();
    for (const photo of photos) {
      if (photo.tags) {
        for (const tag of photo.tags) {
          tagSet.add(tag);
        }
      }
    }

    return Array.from(tagSet).sort();
  },
});

// Internal: check if photo feature announcement was already sent
export const getFeatureAnnouncement = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("featureAnnouncements")
      .withIndex("by_feature", (q) => q.eq("featureName", "photos"))
      .first();
  },
});

// Internal: record that photo feature announcement was sent
export const recordFeatureAnnouncement = internalMutation({
  args: { sentTo: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.insert("featureAnnouncements", {
      featureName: "photos",
      sentAt: Date.now(),
      sentTo: args.sentTo,
    });
  },
});

// Internal action: send photo feature announcement email
export const sendFeatureAnnouncement = internalAction({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.runQuery(
      internal.photos.getFeatureAnnouncement,
      {},
    );

    if (existing) {
      console.log("Photo feature announcement already sent");
      return;
    }

    const env = (
      globalThis as unknown as {
        process?: { env: Record<string, string | undefined> };
      }
    ).process?.env;

    const apiKey = env?.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        "RESEND_API_KEY not set — skipping photo feature announcement",
      );
      return;
    }

    const allowedEmails = (env?.ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (allowedEmails.length === 0) {
      console.warn(
        "ALLOWED_EMAILS not set — skipping photo feature announcement",
      );
      return;
    }

    const resend = new Resend(apiKey);

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #4a9b8e, #7c5cbf); padding: 32px 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">📸 New Feature: Photography!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">A whole new way to share your world</p>
    </div>
    <div style="padding: 24px;">
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #475569; line-height: 1.6;">Hey Elise! A brand new photography section is now live on your site.</p>
      <a href="https://elisereads.com/dashboard/photos" style="display: block; text-align: center; padding: 14px; background: linear-gradient(135deg, #4a9b8e, #7c5cbf); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; margin-bottom: 16px;">Try It Out →</a>
      <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">Your public photo gallery will be at <a href="https://elisereads.com/photos" style="color: #7c5cbf; text-decoration: none;">elisereads.com/photos</a></p>
    </div>
    <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">From Elise Reads ✨</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Elise Reads <noreply@elisereads.com>",
      to: allowedEmails,
      subject: "📸 New on Elise Reads: Photography is here!",
      html,
    });

    await ctx.runMutation(internal.photos.recordFeatureAnnouncement, {
      sentTo: allowedEmails.join(", "),
    });

    console.log("Photo feature announcement sent to", allowedEmails);
  },
});
