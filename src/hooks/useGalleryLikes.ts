import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getVisitorId } from "../lib/visitorId";

function useLikeCore(
  likeMutation: (args: { id: string; visitorId: string }) => Promise<void>,
  errorLabel: string,
) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likingId, setLikingId] = useState<string | null>(null);

  const handleLike = useCallback(
    async (id: string) => {
      if (likedIds.has(id) || likingId === id) return;

      setLikingId(id);
      try {
        await likeMutation({ id, visitorId: getVisitorId() });
        setLikedIds((prev) => new Set([...prev, id]));
      } catch (error) {
        console.error(`Failed to like ${errorLabel}:`, error);
      } finally {
        setLikingId(null);
      }
    },
    [likedIds, likingId, likeMutation, errorLabel],
  );

  return { likedIds, likingId, handleLike };
}

export function useGalleryLikes() {
  const likeMutation = useMutation(api.artworks.like);
  return useLikeCore(likeMutation as unknown as (args: { id: string; visitorId: string }) => Promise<void>, "artwork");
}

export function usePhotoLikes() {
  const likeMutation = useMutation(api.photos.like);
  return useLikeCore(likeMutation as unknown as (args: { id: string; visitorId: string }) => Promise<void>, "photo");
}
