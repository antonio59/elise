/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as artworks from "../artworks.js";
import type * as auth from "../auth.js";
import type * as books from "../books.js";
import type * as follows from "../follows.js";
import type * as goals from "../goals.js";
import type * as likes from "../likes.js";
import type * as notifications from "../notifications.js";
import type * as preferences from "../preferences.js";
import type * as reviews from "../reviews.js";
import type * as search from "../search.js";
import type * as shares from "../shares.js";
import type * as siteSettings from "../siteSettings.js";
import type * as stickers from "../stickers.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  artworks: typeof artworks;
  auth: typeof auth;
  books: typeof books;
  follows: typeof follows;
  goals: typeof goals;
  likes: typeof likes;
  notifications: typeof notifications;
  preferences: typeof preferences;
  reviews: typeof reviews;
  search: typeof search;
  shares: typeof shares;
  siteSettings: typeof siteSettings;
  stickers: typeof stickers;
  storage: typeof storage;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
