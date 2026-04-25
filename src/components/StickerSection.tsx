import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getVisitorId } from "../lib/visitorId";

const STICKER_PACK = [
  "🌸", "✨", "💜", "📚", "⭐", "💫", "🌙", "🦋",
  "🎭", "🍀", "🎨", "💌", "🌈", "🔥", "💎", "🌺",
  "🎀", "🦄", "🍓", "🌟", "👑", "🩷", "🫧", "🧁",
  "🍭", "💝", "🌻", "🎵", "🐾", "🌊",
];

interface StickerSectionProps {
  bookId: string;
}

const StickerSection: React.FC<StickerSectionProps> = ({ bookId }) => {
  const [visitorId] = useState<string>(() => getVisitorId());
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState<string | null>(null);

  const stickerData = useQuery(api.stickers.getForBook, { bookId });
  const visitorStickers = useQuery(api.stickers.getVisitorStickers, { bookId, visitorId }) ?? [];
  const addSticker = useMutation(api.stickers.add);

  const counts: Record<string, number> = stickerData?.counts ?? {};
  const topStickers = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const atLimit = visitorStickers.length >= 2;

  const handlePick = async (sticker: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (atLimit) { setError("You've used both your stickers!"); return; }
    setPlacing(sticker);
    setError(null);
    try {
      await addSticker({ targetId: bookId, sticker, visitorId });
      if (visitorStickers.length + 1 >= 2) setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Try again!");
    } finally {
      setPlacing(null);
    }
  };

  return (
    <div className="relative mt-1.5" onClick={(e) => e.stopPropagation()}>
      {/* Existing sticker pile */}
      {topStickers.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mb-1">
          {topStickers.map(([s, n]) => (
            <span key={s} className="text-sm leading-none" title={`${n} sticker${n > 1 ? "s" : ""}`}>
              {s}
              {n > 1 && <sup className="text-[8px] text-slate-400 ml-px">{n}</sup>}
            </span>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); setError(null); }}
        className="text-[10px] text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-0.5"
      >
        🎀 {atLimit ? "Your stickers" : "Leave a sticker"}
      </button>

      {/* Sticker picker popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-full left-0 z-50 mb-1 bg-slate-50 border border-slate-200 rounded-2xl shadow-xl p-3 w-52"
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <p className="text-[11px] text-slate-500 mb-2 font-medium">
              {atLimit
                ? "You left: " + visitorStickers.join(" ")
                : `Pick a sticker! (${2 - visitorStickers.length} left)`}
            </p>
            {!atLimit && (
              <div className="grid grid-cols-6 gap-1">
                {STICKER_PACK.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => handlePick(s, e)}
                    disabled={!!placing}
                    className={`text-xl leading-none rounded-lg p-1 transition-all hover:bg-primary-50 hover:scale-110 active:scale-95 ${
                      placing === s ? "animate-pulse" : ""
                    } ${visitorStickers.includes(s) ? "opacity-40" : ""}`}
                    title={s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <p className="text-[10px] text-rose-500 mt-2">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StickerSection;
