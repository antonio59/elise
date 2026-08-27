import React, { useState } from "react";
import { upgradeGoogleCoverUrl } from "../lib/coverUrl";

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

/** Muted studio gradients — less rainbow / kawaii than the old pack. */
const GRADIENTS: [string, string][] = [
  ["#c4a4a8", "#6b3d45"], // rose stone
  ["#a8b4c0", "#3d4f5f"], // cool slate
  ["#b8a99a", "#5c4a3a"], // warm taupe
  ["#9aadb8", "#2f4550"], // ink teal
  ["#c9b0b8", "#5a3a48"], // mauve
  ["#adb5a0", "#3f4a38"], // olive
  ["#b0a8c0", "#3d3550"], // dusk
  ["#c4b8a8", "#4a4034"], // sand
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
      style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
    >
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent pt-8 pb-2.5 px-2.5">
        <p className="text-white text-[11px] font-semibold leading-tight line-clamp-3">
          {title}
        </p>
        {author && (
          <p className="text-white/75 text-[9px] mt-0.5 line-clamp-1">{author}</p>
        )}
      </div>
    </div>
  );
};

const CoverImage: React.FC<CoverImageProps> = ({
  book,
  className = "w-full h-full object-cover",
  fallback,
}) => {
  const storageUrl = book.coverImageUrl ?? undefined;
  const googleUrl = book.coverUrl
    ? upgradeGoogleCoverUrl(book.coverUrl, 800)
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
      width={600}
      height={900}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      style={{ aspectRatio: "2/3" }}
      onError={() => setIndex((i) => i + 1)}
    />
  );
};

export default CoverImage;
