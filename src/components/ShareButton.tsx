import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  author?: string;
  path?: string; // e.g. "/books"
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, author, path }) => {
  const [copied, setCopied] = useState(false);

  const url = path
    ? `${window.location.origin}${path}`
    : window.location.href;

  const text = author
    ? `Check out "${title}" by ${author} on Elise Reads! 📚`
    : `Check out "${title}" on Elise Reads! 📚`;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled — fine
      }
      return;
    }
    // Desktop fallback: copy URL to clipboard
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-primary-500 transition-colors"
      title="Share"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Share2 className="w-3 h-3" />
      )}
      {copied ? "Copied!" : "Share"}
    </button>
  );
};

export default ShareButton;
