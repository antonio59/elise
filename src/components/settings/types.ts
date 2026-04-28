export type ThemeValue =
  | "editorial"
  | "sakura"
  | "lavender"
  | "midnight"
  | "sunset"
  | "botanical"
  | "berry"
  | "light"
  | "dark"
  | "kawaii";

export interface SiteSettings {
  siteName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  footerTagline?: string;
  footerNote?: string;
}

export const VALID_THEMES: ThemeValue[] = [
  "editorial",
  "sakura",
  "lavender",
  "midnight",
  "sunset",
  "botanical",
  "berry",
  "light",
  "dark",
  "kawaii",
];
