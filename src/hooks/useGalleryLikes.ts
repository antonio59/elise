import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { getVisitorId } from "../lib/visitorId";

export function useGalleryLikes() {
  const likeMutation = useMutation(api.artworks.like);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likingId, setLikingId] = useState<string | null>(null);

  const handleLike = useCallback(
    async (id: Id<"artworks">) => {
      if (likedIds.has(id) || likingId === id) return;

      setLikingId(id);
      try {
        await likeMutation({ id, visitorId: getVisitorId() });
        setLikedIds((prev) => new Set([...prev, id]));
      } catch (error) {
        console.error("Failed to like artwork:", error);
      } finally {
        setLikingId(null);
      }
    },
    [likedIds, likingId, likeMutation],
  );

  return { likedIds, likingId, handleLike };
}

export function usePhotoLikes() {
  const likeMutation = useMutation(api.photos.like);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likingId, setLikingId] = useState<string | null>(null);

  const handleLike = useCallback(
    async (id: Id<"photos">) => {
      if (likedIds.has(id) || likingId === id) return;

      setLikingId(id);
      try {
        await likeMutation({ id, visitorId: getVisitorId() });
        setLikedIds((prev) => new Set([...prev, id]));
      } catch (error) {
        console.error("Failed to like photo:", error);
      } finally {
        setLikingId(null);
      }
    },
    [likedIds, likingId, likeMutation],
  );

  return { likedIds, likingId, handleLike };
}
