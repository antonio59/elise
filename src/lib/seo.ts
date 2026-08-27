/** Site identity + first-person SEO copy for public pages. */

export const SITE_NAME = "Elise Reads";
export const SITE_URL = "https://elisereads.com";
export const SITE_TAGLINE = "books, art & things I think about";

/** Default share card - crawlers need an absolute PNG/JPG (not SVG). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const DEFAULT_DESCRIPTION =
  "Hi - I'm Elise. Browse books I've finished, art I make, photos I keep, and words I write.";

/** Make a path or URL absolute against the live site origin. */
export function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith("//")) return `https:${pathOrUrl}`;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

export const pageMeta = {
  home: {
    title: "Home",
    description: DEFAULT_DESCRIPTION,
  },
  books: {
    title: "My Books",
    description:
      "Everything on my shelf - what I've finished, what I'm mid-way through, and favourites I keep coming back to.",
  },
  bookDetail: (title: string, author: string) => ({
    title,
    description: `My notes on ${title} by ${author} - rating, mood, and what stuck with me.`,
  }),
  reviews: {
    title: "What I Thought",
    description:
      "Honest takes on books I've read - from all-time favs to solid reads. Tap a cover to peek.",
  },
  reviewDetail: (title: string) => ({
    title: `Review: ${title}`,
    description: `What I thought about ${title} - my rating and full review.`,
  }),
  writing: {
    title: "Writing",
    description:
      "Poems, stories, and journal pages from my studio. Read the ones I've shared.",
  },
  writingDetail: (title: string, type: string) => ({
    title,
    description: `A ${type} I wrote: ${title}.`,
  }),
  art: {
    title: "Art",
    description: "Doodles, sketches, and pieces I'm proud enough to hang up here.",
  },
  photos: {
    title: "Photos",
    description: "Moments I want to remember - my little photo corner.",
  },
  wishlist: {
    title: "Nightstand Wishlist",
    description:
      "Next on my nightstand - books I'd love to read. Suggest one or gift from the list!",
  },
  about: {
    title: "About Me",
    description:
      "Who I am, what I'm reading, favourite genres, and a little of why this site exists.",
  },
} as const;
