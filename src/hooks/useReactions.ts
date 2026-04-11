import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

function getVisitorId(): string {
  const STORAGE_KEY = "elise_visitor_id";
  let visitorId = localStorage.getItem(STORAGE_KEY);

  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(STORAGE_KEY, visitorId);
  }

  return visitorId;
}

type TargetType = "book" | "writing" | "artwork";

export function useReactions(
  targetType: TargetType,
  targetId: string | undefined,
) {
  const [visitorId] = useState(() => getVisitorId());

  const reactionCounts = useQuery(
    api.reactions.getReactions,
    targetId ? { targetType, targetId } : "skip",
  );

  const userReactions = useQuery(
    api.reactions.getUserReactions,
    targetId ? { targetType, targetId, visitorId } : "skip",
  );

  const toggleReaction = useMutation(api.reactions.toggle);

  const toggle = useCallback(
    async (emoji: string) => {
      if (!targetId) return;

      try {
        await toggleReaction({
          targetType,
          targetId,
          emoji,
          visitorId,
        });
      } catch (error) {
        console.error("Failed to toggle reaction:", error);
      }
    },
    [targetType, targetId, visitorId, toggleReaction],
  );

  const totalReactions =
    reactionCounts !== undefined
      ? reactionCounts.reduce(
          (sum: number, r: { count: number }) => sum + r.count,
          0,
        )
      : 0;

  return {
    counts: reactionCounts ?? [],
    userReactions: userReactions ?? [],
    totalReactions,
    toggle,
    isLoading: reactionCounts === undefined,
  };
}
