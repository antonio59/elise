import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import PageHeader from "../components/PageHeader";
import GalleryGrid from "../components/GalleryGrid";
import LightboxModal from "../components/LightboxModal";
import GalleryEmptyState from "../components/GalleryEmptyState";
import { useGalleryLikes } from "../hooks/useGalleryLikes";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

const PublicGallery: React.FC = () => {
  usePageAnnouncement("Gallery");
  usePageMeta({ title: "Art", description: "My artwork gallery" });
  const artworks = useQuery(api.artworks.getPublished, { limit: 50 }) ?? [];
  const { likedIds, likingId, handleLike } = useGalleryLikes();
  const [selectedArt, setSelectedArt] = useState<(typeof artworks)[0] | null>(
    null,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <PageHeader
        badge="Art Gallery"
        title="My Creations"
        subtitle="art inspired by the stories I read"
        breadcrumbs={[{ label: "Art" }]}
      />

      {artworks.length === 0 ? (
        <GalleryEmptyState message="No artworks yet. Check back soon!" />
      ) : (
        <GalleryGrid
          items={artworks}
          targetType="artwork"
          likedIds={likedIds}
          likingId={likingId}
          onLike={(id) => handleLike(id as Id<"artworks">)}
          onSelect={(item) => setSelectedArt(item as (typeof artworks)[0])}
        />
      )}

      <LightboxModal
        item={selectedArt}
        liked={selectedArt ? likedIds.has(selectedArt._id) : false}
        liking={selectedArt ? likingId === selectedArt._id : false}
        onClose={() => setSelectedArt(null)}
        onLike={() => selectedArt && handleLike(selectedArt._id)}
      />
    </div>
  );
};

export default PublicGallery;
