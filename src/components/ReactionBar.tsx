import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getVisitorId } from "../lib/visitorId";

const DEFAULT_EMOJIS = ["❤️", "📚", "✨", "🔥", "😭", "💀", "🤯", "👀"];

interface ReactionBarProps {
  targetType: "book" | "writing" | "artwork" | "photo";
  targetId: string;
  className?: string;
}

const ReactionBar: React.FC<ReactionBarProps> = ({ targetType, targetId, className = "" }) => {
  const [visitorId] = useState<string>(() => getVisitorId());

  const reactions = useQuery(api.reactions.getReactions, visitorId ? { targetType, targetId } : "skip") ?? [];
  const userReactions = useQuery(api.reactions.getUserReactions, visitorId ? { targetType, targetId, visitorId } : "skip") ?? [];
  const toggleReaction = useMutation(api.reactions.toggle);

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
            aria-label={`${emoji} reaction${count > 0 ? `, ${count}` : ""}${hasReacted ? " (active, click to remove)" : ""}`}
            aria-pressed={hasReacted}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-sm
              transition-all duration-200 hover:scale-105 active:scale-95
              ${hasReacted
                ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
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
