import React from "react";
import { motion } from "framer-motion";
import { Smile } from "lucide-react";

interface ReactionStats {
  totalReactions: number;
  topEmojis: { emoji: string; count: number }[];
  mostReactedItems: {
    targetType: string;
    targetId: string;
    title: string;
    count: number;
  }[];
}

interface ReactionsStatsProps {
  reactionStats: ReactionStats | undefined;
}

const ReactionsStats: React.FC<ReactionsStatsProps> = ({ reactionStats }) => {
  if (!reactionStats || reactionStats.totalReactions === 0) return null;

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
          <Smile className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Reactions</h3>
          <p className="text-sm text-slate-500">
            {reactionStats.totalReactions} total reactions from visitors
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Emojis */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Top Emojis
          </h4>
          <div className="flex items-center gap-3">
            {reactionStats.topEmojis.map(
              (item: { emoji: string; count: number }, index: number) => (
                <div
                  key={item.emoji}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-slate-800">
                      {item.count}
                    </span>
                    {index === 0 && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        #1
                      </span>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Most Reacted Items */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Most Popular
          </h4>
          <div className="space-y-2">
            {reactionStats.mostReactedItems.slice(0, 3).map(
              (
                item: {
                  targetType: string;
                  targetId: string;
                  title: string;
                  count: number;
                },
                index: number,
              ) => (
                <div
                  key={`${item.targetType}:${item.targetId}`}
                  className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-medium text-slate-400 w-4">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700 truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-primary-600 ml-2">
                    {item.count} ❤️
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReactionsStats;
