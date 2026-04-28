import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, Tag } from "lucide-react";

interface LightboxItem {
  _id: string;
  imageUrl: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
  likes?: number;
  style?: string;
  medium?: string;
}

interface LightboxModalProps {
  item: LightboxItem | null;
  liked: boolean;
  liking: boolean;
  onClose: () => void;
  onLike: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  liked,
  liking,
  onClose,
  onLike,
}) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] bg-slate-50 rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="flex-1 bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              <div className="p-6 md:w-80">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h2>

                {item.description && (
                  <p className="text-slate-600 mb-4">{item.description}</p>
                )}

                {item.location && (
                  <div className="flex items-center gap-2 mb-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.style && (
                    <span className="badge badge-violet">{item.style}</span>
                  )}
                  {item.medium && (
                    <span className="badge badge-accent">{item.medium}</span>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={onLike}
                  disabled={liked || liking}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    liked
                      ? "bg-primary-100 text-primary-600"
                      : "bg-primary-500 text-white hover:bg-primary-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Heart
                    className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                  />
                  {liked ? "Liked!" : "Like"}
                  {item.likes && (
                    <span className="ml-1">
                      ({item.likes + (liked ? 1 : 0)})
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxModal;
