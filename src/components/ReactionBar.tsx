/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const DEFAULT_EMOJIS = ["❤️", "📚", "✨", "🔥", "😭", "💀", "🤯", "👀"];

interface ReactionBarProps {
  targetType: "book" | "writing" | "artwork";
  targetId: string;
  className?: string;
}

const getVisitorId = (): string => {
  const STORAGE_KEY = "elise-visitor-id";
  let id = sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};

const ReactionBar: React.FC<ReactionBarProps> = ({ targetType, targetId, className = "" }) => {
  const [visitorId] = useState<string>(() => getVisitorId());

  const reactions = useQuery(
    (api as any).reactions.getReactions,
    visitorId ? { targetType, targetId } : "skip"
  ) ?? [];

  const userReactions = useQuery(
    (api as any).reactions.getUserReactions,
    visitorId ? { targetType, targetId, visitorId } : "skip"
  ) ?? [];

  const toggleReaction = useMutation((api as any).reactions.toggle);

  const handleToggle = async (emoji: string) => {
    if (!visitorId) return;
    await toggleReaction({ targetType, targetId, emoji, visitorId });
  };

  // Create a map of emoji -> count
  const reactionCounts: Record<string, number> = {};
  for (const r of reactions) {
    reactionCounts[r.emoji] = r.count;
  }

  // Create a set of emojis the user has reacted with
  const userReactionSet = new Set(userReactions);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {DEFAULT_EMOJIS.map((emoji) => {
        const count = reactionCounts[emoji] || 0;
        const hasReacted = userReactionSet.has(emoji);

        return (
          <button
            key={emoji}
            onClick={() => handleToggle(emoji)}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-sm
              transition-all duration-200 hover:scale-105 active:scale-95
              ${hasReacted
                ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
            title={hasReacted ? "Click to remove reaction" : "Click to react"}
          >
            <span className="text-base">{emoji}</span>
            {count > 0 && (
              <span className={`text-xs font-medium ${hasReacted ? "text-primary-600" : "text-slate-500"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionBar;
