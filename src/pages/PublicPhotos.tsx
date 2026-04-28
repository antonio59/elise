import React, { useState } from "react";
import { Camera, Folder } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import PageHeader from "../components/PageHeader";
import GalleryGrid from "../components/GalleryGrid";
import LightboxModal from "../components/LightboxModal";
import GalleryEmptyState from "../components/GalleryEmptyState";
import { usePhotoLikes } from "../hooks/useGalleryLikes";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

const PublicPhotos: React.FC = () => {
  usePageAnnouncement("Photos");
  usePageMeta({ title: "Photos", description: "My photography gallery" });

  const photos = useQuery(api.photos.getPublished, { limit: 100 }) ?? [];
  const albums = useQuery(api.photos.getAlbums) ?? [];
  const tags = useQuery(api.photos.getTags) ?? [];

  const { likedIds, likingId, handleLike } = usePhotoLikes();
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[0] | null>(
    null,
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | "all">("all");

  const filteredPhotos = photos.filter((photo) => {
    const tagMatch = selectedTag ? photo.tags?.includes(selectedTag) : true;
    const albumMatch =
      selectedAlbum !== "all" ? photo.albumId === selectedAlbum : true;
    return tagMatch && albumMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <PageHeader
        badge="Photo Gallery"
        title="Through My Lens"
        subtitle="moments captured, memories kept"
        breadcrumbs={[{ label: "Photos" }]}
      />

      {/* Album Filter */}
      {albums.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setSelectedAlbum("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedAlbum === "all"
                ? "bg-primary-100 text-primary-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            All Photos
          </button>
          {albums.map((album) => (
            <button
              key={album._id}
              onClick={() => setSelectedAlbum(album._id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedAlbum === album._id
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              {album.title}
            </button>
          ))}
        </div>
      )}

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedTag === null
                ? "bg-primary-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setSelectedTag(tag === selectedTag ? null : tag)
              }
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedTag === tag
                  ? "bg-primary-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      {filteredPhotos.length === 0 ? (
        <GalleryEmptyState message="No photos yet. Check back soon!" />
      ) : (
        <GalleryGrid
          items={filteredPhotos}
          targetType="photo"
          likedIds={likedIds}
          likingId={likingId}
          onLike={(id) => handleLike(id as Id<"photos">)}
          onSelect={(item) => setSelectedPhoto(item as (typeof photos)[0])}
        />
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        item={selectedPhoto}
        liked={selectedPhoto ? likedIds.has(selectedPhoto._id) : false}
        liking={selectedPhoto ? likingId === selectedPhoto._id : false}
        onClose={() => setSelectedPhoto(null)}
        onLike={() => selectedPhoto && handleLike(selectedPhoto._id)}
      />
    </div>
  );
};

export default PublicPhotos;
