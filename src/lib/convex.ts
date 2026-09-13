import { ConvexReactClient } from "convex/react";

// The deployment URL is public by nature (it's sent to every visitor's
// browser), so the production URL is a safe default — builds still work
// even if the host's env vars aren't configured. Local dev overrides this
// via .env.local.
const PRODUCTION_CONVEX_URL = "https://agile-shrimp-456.convex.cloud";

export const convexUrl =
  (import.meta.env.VITE_CONVEX_URL as string | undefined) ||
  PRODUCTION_CONVEX_URL;

if (!import.meta.env.VITE_CONVEX_URL && import.meta.env.DEV) {
  console.warn("VITE_CONVEX_URL not set — using production default.");
}

export const convex = new ConvexReactClient(convexUrl);
