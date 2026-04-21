import React, { useState } from "react";

interface CoverImageProps {
  book: {
    coverImageUrl?: string | null;
    coverStorageId?: string;
    coverUrl?: string;
    isbn?: string;
    title: string;
    author?: string;
  };
  className?: string;
  fallback?: React.ReactNode;
}

// Eight gradient pairs that complement the dusty-rose / teal design system.
const GRADIENTS: [string, string][] = [
  ["#e0b8a8", "#9a5640"], // dusty rose
  ["#9fb3c8", "#06b6d4"], // slate → teal
  ["#d8b4fe", "#7c3aed"], // lavender → violet
  ["#fcd34d", "#f97316"], // amber → orange
  ["#6ee7b7", "#0d9488"], // mint → teal
  ["#fda4af", "#e11d48"], // blush → crimson
  ["#93c5fd", "#2563eb"], // sky → blue
  ["#f0abfc", "#a21caf"], // pink → fuchsia
];

function pickGradient(title: string): [string, string] {
  let hash = 0;
  for (const ch of title) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return GRADIENTS[hash % GRADIENTS.length];
}

const GradientCard: React.FC<{ title: string; author?: string }> = ({
  title,
  author,
}) => {
  const [from, to] = pickGradient(title);
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {/* Decorative circles for depth */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/15" />
      <div className="absolute top-4 -left-4 w-12 h-12 rounded-full bg-black/10" />
      <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-black/10" />

      {/* Title + author pinned to the bottom with a scrim */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pt-6 pb-2 px-2">
        <p className="text-white text-[11px] font-bold leading-tight line-clamp-3 drop-shadow">
          {title}
        </p>
        {author && (
          <p className="text-white/70 text-[9px] mt-0.5 line-clamp-1 drop-shadow">
            {author}
          </p>
        )}
      </div>
    </div>
  );
};

/** Upgrade a Google Books cover URL to the largest available zoom level. */
function upgradeGoogleZoom(url: string, zoom = 3): string {
  try {
    const cleaned = url.replace(/&amp;/g, "&").replace("http://", "https://");
    const u = new URL(cleaned);
    if (
      u.hostname === "books.google.com" ||
      u.hostname.endsWith(".books.google.com")
    ) {
      u.searchParams.set("zoom", String(zoom));
      u.searchParams.delete("edge"); // Remove curl effect for cleaner images
    }
    return u.toString();
  } catch {
    return url.replace(/&amp;/g, "&").replace("http://", "https://");
  }
}

const CoverImage: React.FC<CoverImageProps> = ({
  book,
  className = "w-full h-full object-cover",
  fallback,
}) => {
  const storageUrl = book.coverImageUrl ?? undefined;
  const googleUrl = book.coverUrl
    ? upgradeGoogleZoom(book.coverUrl)
    : undefined;
  const openLibraryUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : undefined;

  const urls = [storageUrl, googleUrl, openLibraryUrl].filter(
    (u): u is string => !!u,
  );

  const [index, setIndex] = useState(0);
  const src = urls[index];

  if (!src) {
    return fallback ?? <GradientCard title={book.title} author={book.author} />;
  }

  return (
    <img
      key={src}
      src={src}
      alt={book.title}
      className={className}
      loading="lazy"
      decoding="async"
      width={400}
      height={600}
      style={{ aspectRatio: "2/3" }}
      onError={() => setIndex((i) => i + 1)}
    />
  );
};

export default CoverImage;
