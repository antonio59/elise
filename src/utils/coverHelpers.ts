export function getGradientFromTitle(title: string): string {
  const gradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-rose-500 via-pink-500 to-purple-500",
    "from-blue-500 via-indigo-500 to-violet-500",
    "from-teal-500 via-emerald-500 to-green-500",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-pink-500 via-rose-500 to-red-500",
    "from-indigo-500 via-purple-500 to-pink-500",
  ];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

export function getEmojiForGenre(genre?: string): string {
  if (!genre) return "📖";

  const genreEmojis: Record<string, string> = {
    fantasy: "🧙‍♂️",
    "science fiction": "🚀",
    mystery: "🔍",
    romance: "💕",
    horror: "👻",
    adventure: "🗺️",
    historical: "🏰",
    biography: "📜",
    "non-fiction": "🎓",
    humor: "😂",
    poetry: "🌸",
    thriller: "🔪",
    drama: "🎭",
    "graphic novel": "📚",
    fiction: "📖",
    children: "🧸",
    kids: "🧸",
  };

  const lowerGenre = genre.toLowerCase();

  for (const [key, emoji] of Object.entries(genreEmojis)) {
    if (lowerGenre.includes(key)) return emoji;
  }

  return "📖";
}

export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(img.naturalWidth > 0 && img.naturalHeight > 0);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.onabort = () => {
      resolve(false);
    };

    setTimeout(() => {
      resolve(false);
    }, 5000);

    img.src = url;
  });
}

export function isLikelyValidCover(url?: string): boolean {
  if (!url) return false;

  const placeholderPatterns = [
    "placeholder",
    "default",
    "noimage",
    "blank",
    "missing",
  ];

  const lowerUrl = url.toLowerCase();
  if (placeholderPatterns.some((p) => lowerUrl.includes(p))) {
    return false;
  }

  try {
    const { hostname } = new URL(url);
    if (hostname === "covers.openlibrary.org") return true;
    if (hostname === "books.google.com") return true;
  } catch {
    return false;
  }

  return (
    url.startsWith("http") &&
    (url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.includes("?"))
  );
}

export async function getBestCoverUrl(options: {
  openLibraryId?: number;
  isbn?: string;
  googleCoverUrl?: string;
  title: string;
  size?: "S" | "M" | "L";
}): Promise<string | null> {
  const { openLibraryId, isbn, googleCoverUrl, size = "M" } = options;

  if (googleCoverUrl && isLikelyValidCover(googleCoverUrl)) {
    const isValid = await preloadImage(googleCoverUrl);
    if (isValid) return googleCoverUrl;
  }

  if (openLibraryId) {
    const url = `https://covers.openlibrary.org/b/id/${openLibraryId}-${size}.jpg`;
    const isValid = await preloadImage(url);
    if (isValid) return url;
  }

  if (isbn) {
    const url = `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
    const isValid = await preloadImage(url);
    if (isValid) return url;
  }

  return null;
}
