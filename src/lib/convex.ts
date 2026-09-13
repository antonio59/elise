import { ConvexReactClient } from "convex/react";

export const convexUrl = import.meta.env.VITE_CONVEX_URL as
  | string
  | undefined;

if (!convexUrl && import.meta.env.DEV) {
  console.warn("VITE_CONVEX_URL not set. Add it to your .env file.");
}

export const convex = convexUrl
  ? new ConvexReactClient(convexUrl)
  : null;
