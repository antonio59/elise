import React from "react";
import { motion } from "framer-motion";
import { Heart, Tag } from "lucide-react";
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

const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  targetType,
  likedIds,
  likingId,
  onLike,
  onSelect,
}) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {items.map((item, index: number) => (
        <motion.div
          key={item._id}
          className="group relative break-inside-avoid cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(item)}
          whileHover={{ scale: 1.01 }}
        >
          <div className="rounded-2xl overflow-hidden bg-slate-50 shadow-sm hover:shadow-xl transition-all">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                {item.location && (
                  <p className="text-white/80 text-xs mt-1">{item.location}</p>
                )}
              </div>
            </div>

            {/* Like button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(item._id);
              }}
              disabled={likingId === item._id}
              aria-label={likedIds.has(item._id) ? "Unlike" : "Like"}
              aria-pressed={likedIds.has(item._id)}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                likedIds.has(item._id)
                  ? "bg-primary-500 text-white"
                  : "bg-white/90 text-slate-600 hover:text-primary-500"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart
                className={`w-4 h-4 ${likedIds.has(item._id) ? "fill-current" : ""}`}
              />
            </button>

            {/* Like count */}
            {item.likes && item.likes > 0 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-slate-900/50 rounded-full text-white text-xs">
                <Heart className="w-3 h-3 fill-current" />
                {item.likes + (likedIds.has(item._id) ? 1 : 0)}
              </div>
            )}

            {/* Tags on hover */}
            {item.tags && item.tags.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs text-slate-700 flex items-center gap-0.5"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reaction Bar */}
            <div className="absolute bottom-3 left-3 right-16 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <ReactionBar
                targetType={targetType}
                targetId={item._id}
                className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;
