/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 */

import type { FilterApi, FunctionReference } from "convex/server";

export declare const api: {
  artworks: {
    getPublished: FunctionReference<
      "query",
      "public",
      { limit?: number },
      any[]
    >;
    getMyArtworks: FunctionReference<"query", "public", {}, any[]>;
    getBySeries: FunctionReference<"query", "public", { seriesId: any }, any[]>;
    getById: FunctionReference<"query", "public", { id: any }, any>;
    create: FunctionReference<"mutation", "public", any, any>;
    update: FunctionReference<"mutation", "public", any, any>;
    remove: FunctionReference<"mutation", "public", { id: any }, any>;
    like: FunctionReference<"mutation", "public", { id: any }, any>;
    getMySeries: FunctionReference<"query", "public", {}, any[]>;
    createSeries: FunctionReference<"mutation", "public", any, any>;
  };
  books: {
    getMyBooks: FunctionReference<"query", "public", {}, any[]>;
    getByStatus: FunctionReference<
      "query",
      "public",
      { status: "reading" | "read" | "wishlist" },
      any[]
    >;
    getReadBooks: FunctionReference<"query", "public", {}, any[]>;
    getFavorites: FunctionReference<"query", "public", {}, any[]>;
    add: FunctionReference<"mutation", "public", any, any>;
    update: FunctionReference<"mutation", "public", any, any>;
    remove: FunctionReference<"mutation", "public", { id: any }, any>;
    toggleFavorite: FunctionReference<"mutation", "public", { id: any }, any>;
  };
  users: {
    getCurrentUser: FunctionReference<"query", "public", {}, any>;
    getProfile: FunctionReference<"query", "public", {}, any>;
    createProfile: FunctionReference<"mutation", "public", any, any>;
    updateProfile: FunctionReference<"mutation", "public", any, any>;
    getStats: FunctionReference<"query", "public", {}, any>;
  };
  auth: {
    signIn: FunctionReference<"mutation", "public", any, any>;
    signOut: FunctionReference<"mutation", "public", any, any>;
  };
};
