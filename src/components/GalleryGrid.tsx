import React from "react";
import { motion } from "framer-motion";
import { Heart, Pin } from "lucide-react";
import ReactionBar from "./ReactionBar";

interface GalleryItem {
  _id: string;
  imageUrl: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
  likes?: number;
}

interface GalleryGridProps {
  items: GalleryItem[];
  targetType: "artwork" | "photo";
  likedIds: Set<string>;
  likingId: string | null;
  onLike: (id: string) => void;
  onSelect: (item: GalleryItem) => void;
}

/**
 * Pinterest-style masonry pin wall - cover-forward, Save on hover, tight gaps.
 */
const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  targetType,
  likedIds,
  likingId,
  onLike,
  onSelect,
}) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
      {items.map((item, index: number) => (
        <motion.div
          key={item._id}
          className="group relative break-inside-avoid cursor-pointer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.04, 0.4) }}
          onClick={() => onSelect(item)}
        >
          <div className="relative overflow-hidden rounded-xl bg-slate-100 shadow-sm group-hover:shadow-lg transition-shadow duration-200">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />

            {/* Soft hover scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Save (pin) - Pinterest-like primary action */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike(item._id);
              }}
              disabled={likingId === item._id}
              aria-label={likedIds.has(item._id) ? "Unsave pin" : "Save pin"}
              aria-pressed={likedIds.has(item._id)}
              className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 min-h-9 px-3 rounded-lg text-xs font-semibold shadow-md transition-all ${
                likedIds.has(item._id)
                  ? "bg-primary-600 text-white"
                  : "bg-primary-500 text-white opacity-0 group-hover:opacity-100 hover:bg-primary-600"
              } disabled:opacity-50`}
            >
              <Pin
                className={`w-3.5 h-3.5 ${likedIds.has(item._id) ? "fill-current" : ""}`}
              />
              {likedIds.has(item._id) ? "Saved" : "Save"}
            </button>

            {/* Title + count */}
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 drop-shadow">
                {item.title}
              </h3>
              {item.location && (
                <p className="text-white/80 text-[11px] mt-0.5">{item.location}</p>
              )}
              {(item.likes ?? 0) > 0 && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-white/90 text-[11px]">
                  <Heart className="w-3 h-3 fill-current" />
                  {(item.likes ?? 0) + (likedIds.has(item._id) ? 1 : 0)}
                </div>
              )}
            </div>

            {/* Reactions - desktop hover only */}
            <div className="absolute bottom-2.5 left-2.5 right-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
              <ReactionBar
                targetType={targetType}
                targetId={item._id}
                className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;
