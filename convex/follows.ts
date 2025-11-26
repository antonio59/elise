import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: {
    token: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    if (session.userId === args.userId) {
      throw new Error("Cannot follow yourself");
    }

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", session.userId).eq("followingId", args.userId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { following: false };
    }

    await ctx.db.insert("follows", {
      followerId: session.userId,
      followingId: args.userId,
      createdAt: Date.now(),
    });

    // Create notification
    const users = await ctx.db.query("users").collect();
    const follower = users.find((u) => u._id === session.userId);
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "follow",
      message: `${follower?.username || "Someone"} started following you`,
      fromUserId: session.userId,
      read: false,
      createdAt: Date.now(),
    });

    return { following: true };
  },
});

export const getFollowStatus = query({
  args: {
    token: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      return { following: false };
    }

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { following: false };
    }

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", session.userId).eq("followingId", args.userId)
      )
      .first();

    return { following: !!existing };
  },
});

export const getFollowerCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();

    return followers.length;
  },
});

export const getFollowingCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();

    return following.length;
  },
});

export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();

    return Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db.get(follow.followerId);
        return user
          ? {
              _id: user._id,
              username: user.username,
              avatarUrl: user.avatarUrl,
            }
          : null;
      })
    ).then((users) => users.filter(Boolean));
  },
});

export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();

    return Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db.get(follow.followingId);
        return user
          ? {
              _id: user._id,
              username: user.username,
              avatarUrl: user.avatarUrl,
            }
          : null;
      })
    ).then((users) => users.filter(Boolean));
  },
});
