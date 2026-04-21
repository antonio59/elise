import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import ReactionBar from "../components/ReactionBar";
import PageHeader from "../components/PageHeader";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { getVisitorId } from "../lib/visitorId";

const PublicGallery: React.FC = () => {
  usePageAnnouncement("Gallery");
  usePageMeta({ title: "Art", description: "My artwork gallery" });
  const artworks = useQuery(api.artworks.getPublished, { limit: 50 }) ?? [];
  const likeArtwork = useMutation(api.artworks.like);
  const [selectedArt, setSelectedArt] = useState<(typeof artworks)[0] | null>(
    null,
  );
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const handleLike = async (id: Id<"artworks">) => {
    if (likedIds.has(id)) return;

    try {
      await likeArtwork({ id, visitorId: getVisitorId() });
      setLikedIds(new Set([...likedIds, id]));
    } catch (error) {
      console.error("Failed to like artwork:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <PageHeader
        badge="Art Gallery"
        title="My Creations"
        subtitle="art inspired by the stories I read"
        breadcrumbs={[{ label: "Art" }]}
      />

      {/* Gallery Grid */}
      {artworks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No artworks yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artworks.map((art: (typeof artworks)[number], index: number) => (
            <motion.div
              key={art._id}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedArt(art)}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{art.title}</h3>
                  {art.style && (
                    <span className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-white text-xs mt-1">
                      {art.style}
                    </span>
                  )}
                </div>
              </div>

              {/* Like button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(art._id);
                }}
                aria-label={likedIds.has(art._id) ? "Unlike artwork" : "Like artwork"}
                aria-pressed={likedIds.has(art._id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                  likedIds.has(art._id)
                    ? "bg-primary-500 text-white"
                    : "bg-white/90 text-slate-600 hover:text-primary-500"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${likedIds.has(art._id) ? "fill-current" : ""}`}
                />
              </button>

              {/* Like count */}
              {art.likes && art.likes > 0 && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                  <Heart className="w-3 h-3 fill-current" />
                  {art.likes + (likedIds.has(art._id) ? 1 : 0)}
                </div>
              )}

              {/* Reaction Bar */}
              <div className="absolute bottom-3 left-3 right-16 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <ReactionBar
                  targetType="artwork"
                  targetId={art._id}
                  className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArt(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArt(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                  <img
                    src={selectedArt.imageUrl}
                    alt={selectedArt.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                </div>
                <div className="p-6 md:w-80">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {selectedArt.title}
                  </h2>

                  {selectedArt.description && (
                    <p className="text-slate-600 mb-4">
                      {selectedArt.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedArt.style && (
                      <span className="badge badge-violet">
                        {selectedArt.style}
                      </span>
                    )}
                    {selectedArt.medium && (
                      <span className="badge badge-accent">
                        {selectedArt.medium}
                      </span>
                    )}
                  </div>

                  {selectedArt.tags && selectedArt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {selectedArt.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleLike(selectedArt._id)}
                    disabled={likedIds.has(selectedArt._id)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                      likedIds.has(selectedArt._id)
                        ? "bg-primary-100 text-primary-600"
                        : "bg-primary-500 text-white hover:bg-primary-600"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${likedIds.has(selectedArt._id) ? "fill-current" : ""}`}
                    />
                    {likedIds.has(selectedArt._id) ? "Liked!" : "Like this art"}
                    {selectedArt.likes && (
                      <span className="ml-1">
                        (
                        {selectedArt.likes +
                          (likedIds.has(selectedArt._id) ? 1 : 0)}
                        )
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicGallery;
