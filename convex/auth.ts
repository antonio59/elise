import bcrypt from "bcryptjs";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { normalizeEmail, sanitizeOptionalUrl, sanitizePlainText } from "./utils";

const PASSWORD_MIN_LENGTH = 8;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function legacySha256(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, storedHash: string) {
  // If stored hash looks like legacy SHA-256 (64 hex chars), verify and upgrade
  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    const legacy = await legacySha256(password);
    return legacy === storedHash;
  }
  return await bcrypt.compare(password, storedHash);
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function enforceRateLimit(ctx: any, identifier: string, action: string) {
  const now = Date.now();
  const record = await ctx.db
    .query("rateLimits")
    .withIndex("by_identifier_action", (q: any) => q.eq("identifier", identifier).eq("action", action))
    .first();

  if (!record || record.windowExpiresAt <= now) {
    if (record) await ctx.db.delete(record._id);
    await ctx.db.insert("rateLimits", {
      identifier,
      action,
      count: 1,
      windowExpiresAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    throw new Error("Too many attempts. Please try again in a few minutes.");
  }

  await ctx.db.patch(record._id, { count: record.count + 1 });
}

function buildUserResponse(user: any) {
  if (!user) return null;
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt,
  } as const;
}

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("child"), v.literal("parent")),
    clientHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);

    await enforceRateLimit(ctx, args.clientHash ?? email, "register");

    if (args.password.length < PASSWORD_MIN_LENGTH) {
      throw new Error("Password must be at least 8 characters long");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(args.password);
    const userId = await ctx.db.insert("users", {
      email,
      passwordHash,
      role: args.role,
      createdAt: Date.now(),
    });

    const token = generateToken();
    const expiresAt = Date.now() + SESSION_TTL_MS;

    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt,
    });

    const user = await ctx.db.get(userId);
    return { user: buildUserResponse(user), token, expiresAt };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    clientHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);

    await enforceRateLimit(ctx, args.clientHash ?? email, "login");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await verifyPassword(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Upgrade legacy hashes transparently
    if (/^[a-f0-9]{64}$/i.test(user.passwordHash)) {
      const newHash = await hashPassword(args.password);
      await ctx.db.patch(user._id, { passwordHash: newHash });
    }

    const token = generateToken();
    const expiresAt = Date.now() + SESSION_TTL_MS;

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
    });

    return { user: buildUserResponse(user), token, expiresAt };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const getSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return buildUserResponse(user);
  },
});

export const getCurrentUser = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;
    const token = args.token;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    };
  },
});

export const updateProfile = mutation({
  args: {
    token: v.string(),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const username = sanitizePlainText(args.username, 60);
    const bio = sanitizePlainText(args.bio, 500);
    const avatarUrl = sanitizeOptionalUrl(args.avatarUrl);

    await ctx.db.patch(session.userId, {
      username,
      bio,
      avatarUrl,
    });

    return await ctx.db.get(session.userId);
  },
});
