import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMyNotifications = query({
  args: { token: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (!args.token) return [];

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .take(args.limit ?? 20);

    return Promise.all(
      notifications.map(async (n) => {
        let fromUser = null;
        if (n.fromUserId) {
          const user = await ctx.db.get(n.fromUserId);
          if (user) {
            fromUser = { _id: user._id, username: user.username, avatarUrl: user.avatarUrl };
          }
        }
        return { ...n, fromUser };
      })
    );
  },
});

export const getUnreadCount = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return 0;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", session.userId).eq("read", false))
      .collect();

    return unread.length;
  },
});

export const markAsRead = mutation({
  args: { token: v.string(), notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== session.userId) return;

    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllAsRead = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", session.userId).eq("read", false))
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { read: true });
    }
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(v.literal("like"), v.literal("follow"), v.literal("achievement"), v.literal("goal")),
    message: v.string(),
    fromUserId: v.optional(v.id("users")),
    contentId: v.optional(v.string()),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      message: args.message,
      fromUserId: args.fromUserId,
      contentId: args.contentId,
      contentType: args.contentType,
      read: false,
      createdAt: Date.now(),
    });
  },
});
