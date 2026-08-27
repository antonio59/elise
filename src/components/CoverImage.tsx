import React, { useState } from "react";
import {
  upgradeGoogleCoverUrl,
  isGoogleUnavailableSize,
} from "../lib/coverUrl";

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

/** Muted studio gradients - less rainbow / kawaii than the old pack. */
const GRADIENTS: [string, string][] = [
  ["#c4a4a8", "#6b3d45"],
  ["#a8b4c0", "#3d4f5f"],
  ["#b8a99a", "#5c4a3a"],
  ["#9aadb8", "#2f4550"],
  ["#c9b0b8", "#5a3a48"],
  ["#adb5a0", "#3f4a38"],
  ["#b0a8c0", "#3d3550"],
  ["#c4b8a8", "#4a4034"],
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

function isUnusableCover(width: number, height: number): boolean {
  if (width > 0 && width < 200) return true;
  return isGoogleUnavailableSize(width, height);
}

const CoverImage: React.FC<CoverImageProps> = ({
  book,
  className = "w-full h-full object-cover",
  fallback,
}) => {
  const storageUrl = book.coverImageUrl ?? undefined;
  // Client fallback: do NOT use fife=w800 — that upscales Google's gray
  // “image not available” PNG. zoom=1 keeps a real thumb or a tiny stub we skip.
  const googleUrl = book.coverUrl
    ? (() => {
        try {
          const u = new URL(
            book.coverUrl.replace(/&amp;/g, "&").replace(/^http:\/\//i, "https://"),
          );
          u.searchParams.delete("edge");
          u.searchParams.delete("pg");
          u.searchParams.delete("fife");
          u.searchParams.set("zoom", "1");
          return u.toString();
        } catch {
          return upgradeGoogleCoverUrl(book.coverUrl, 400);
        }
      })()
    : undefined;
  const openLibraryUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : undefined;

  const urls = [storageUrl, googleUrl, openLibraryUrl].filter(
    (u): u is string => !!u,
  );

  const [index, setIndex] = useState(0);
  const src = urls[index];
  const advance = () => setIndex((i) => i + 1);

  if (!src || index >= urls.length) {
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
      onError={advance}
      onLoad={(e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (isUnusableCover(naturalWidth, naturalHeight)) advance();
      }}
    />
  );
};

export default CoverImage;
