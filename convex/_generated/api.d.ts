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
import type * as bookSuggestions from "../bookSuggestions.js";
import type * as books from "../books.js";
import type * as characters from "../characters.js";
import type * as cleanup from "../cleanup.js";
import type * as covers from "../covers.js";
import type * as crons from "../crons.js";
import type * as discover from "../discover.js";
import type * as emails from "../emails.js";
import type * as giphy from "../giphy.js";
import type * as googleBooks from "../googleBooks.js";
import type * as http from "../http.js";
import type * as ideas from "../ideas.js";
import type * as lib_rateLimit from "../lib/rateLimit.js";
import type * as migrations from "../migrations.js";
import type * as photos from "../photos.js";
import type * as quotes from "../quotes.js";
import type * as reactions from "../reactions.js";
import type * as readingGoals from "../readingGoals.js";
import type * as readingStreaks from "../readingStreaks.js";
import type * as seed from "../seed.js";
import type * as siteSettings from "../siteSettings.js";
import type * as stickers from "../stickers.js";
import type * as users from "../users.js";
import type * as weeklyEmail from "../weeklyEmail.js";
import type * as writingStreaks from "../writingStreaks.js";
import type * as writings from "../writings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  artworks: typeof artworks;
  auth: typeof auth;
  bookSuggestions: typeof bookSuggestions;
  books: typeof books;
  characters: typeof characters;
  cleanup: typeof cleanup;
  covers: typeof covers;
  crons: typeof crons;
  discover: typeof discover;
  emails: typeof emails;
  giphy: typeof giphy;
  googleBooks: typeof googleBooks;
  http: typeof http;
  ideas: typeof ideas;
  "lib/rateLimit": typeof lib_rateLimit;
  migrations: typeof migrations;
  photos: typeof photos;
  quotes: typeof quotes;
  reactions: typeof reactions;
  readingGoals: typeof readingGoals;
  readingStreaks: typeof readingStreaks;
  seed: typeof seed;
  siteSettings: typeof siteSettings;
  stickers: typeof stickers;
  users: typeof users;
  weeklyEmail: typeof weeklyEmail;
  writingStreaks: typeof writingStreaks;
  writings: typeof writings;
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
