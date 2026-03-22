import React from "react";
import { getCoverUrl, getFallbackCoverUrl } from "../utils/cover";

interface CoverImageProps {
  book: { coverStorageId?: string; coverUrl?: string; title?: string; author?: string };
  className?: string;
  alt?: string;
}

const GRADIENTS: [string, string][] = [
  ["#f472b6", "#ec4899"],
  ["#a78bfa", "#a855f7"],
  ["#38bdf8", "#3b82f6"],
  ["#34d399", "#14b8a6"],
  ["#fbbf24", "#f97316"],
  ["#e879f9", "#ec4899"],
  ["#818cf8", "#a78bfa"],
  ["#22d3ee", "#38bdf8"],
  ["#f87171", "#fb7185"],
  ["#a3e635", "#22c55e"],
];

function titleToGradient(title: string): { from: string; to: string } {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [from, to] = GRADIENTS[Math.abs(hash) % GRADIENTS.length];
  return { from, to };
}

function replaceWithTitleCard(img: HTMLImageElement, title: string, author?: string) {
  const parent = img.parentElement;
  if (!parent) return;
  const { from, to } = titleToGradient(title);
  const el = document.createElement("div");
  el.style.cssText = `background:linear-gradient(to bottom right,${from},${to});width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.75rem;text-align:center`;
  const p = document.createElement("p");
  p.style.cssText = "color:white;font-weight:bold;font-size:0.75rem;line-height:1.2";
  p.textContent = title;
  el.appendChild(p);
  if (author) {
    const a = document.createElement("p");
    a.style.cssText = "color:rgba(255,255,255,0.7);font-size:0.625rem;margin-top:0.25rem";
    a.textContent = author;
    el.appendChild(a);
  }
  parent.replaceChild(el, img);
}

function handleFallback(
  img: HTMLImageElement,
  fallbackUrl: string | undefined,
  title: string,
  author?: string
) {
  if (fallbackUrl && img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    replaceWithTitleCard(img, title, author);
  }
}

const CoverImage: React.FC<CoverImageProps> = ({ book, className = "", alt }) => {
  const primaryUrl = getCoverUrl(book);
  const fallbackUrl = getFallbackCoverUrl(book);
  const title = book.title || "Untitled";
  const author = book.author;

  // No URL at all — show title card immediately
  if (!primaryUrl) {
    const { from, to } = titleToGradient(title);
    return (
      <div
        style={{ background: `linear-gradient(to bottom right, ${from}, ${to})` }}
        className={`flex flex-col items-center justify-center p-3 text-center ${className}`}
      >
        <p className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-4 drop-shadow-sm">
          {title}
        </p>
        {author && (
          <p className="text-white/70 text-[9px] sm:text-[10px] mt-1 line-clamp-1">{author}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={primaryUrl}
      alt={alt || title}
      className={className}
      
      onError={(e) => handleFallback(e.currentTarget, fallbackUrl, title, author)}
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth < 100 || img.naturalHeight < 100) {
          handleFallback(img, fallbackUrl, title, author);
        }
      }}
    />
  );
};

export default CoverImage;
