import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Feather, BookHeart, BookOpenText } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ReactionBar from "../components/ReactionBar";
import PageHeader from "../components/PageHeader";
import { WritingCardSkeleton } from "../components/Skeleton";
import { Button } from "../components/ui/Button";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

interface Writing {
  _id: string;
  title: string;
  content: string;
  type: "poetry" | "story" | "journal";
  createdAt: number;
}

const PublicWritings: React.FC = () => {
  usePageAnnouncement("Writings");
  usePageMeta({ title: "Writing", description: "Stories, poems, and thoughts" });
  const writingsRaw = useQuery(api.writings.getPublished, { limit: 20 });
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const typeConfig: Record<
    string,
    { icon: typeof Feather; color: string; label: string; bg: string }
  > = {
    poetry: {
      icon: Feather,
      color: "text-violet-500",
      label: "Poetry",
      bg: "bg-violet-50",
    },
    story: {
      icon: BookHeart,
      color: "text-primary-500",
      label: "Story",
      bg: "bg-primary-50",
    },
    journal: {
      icon: BookOpenText,
      color: "text-accent-500",
      label: "Journal",
      bg: "bg-accent-50",
    },
  };

  const writings = writingsRaw ?? [];

  const types = useMemo(
    () => [...new Set(writings.map((w: Writing) => w.type))],
    [writings],
  );

  const filtered = useMemo(
    () => writings.filter((w: Writing) => !typeFilter || w.type === typeFilter),
    [writings, typeFilter],
  );

  if (writingsRaw === undefined) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <PageHeader
          badge="Creative Writing"
          title="Words & Worlds"
          subtitle="stories, poems, and thoughts"
          breadcrumbs={[{ label: "Writing" }]}
        />
        <WritingCardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <PageHeader
        badge="Creative Writing"
        title="Words & Worlds"
        subtitle="stories, poems, and thoughts"
        breadcrumbs={[{ label: "Writing" }]}
      />

      {/* Category Filter */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={!typeFilter ? "primary" : "secondary"}
            size="sm"
            className="rounded-full text-xs"
            onClick={() => setTypeFilter(null)}
          >
            All
          </Button>
          {types.map((type: string) => {
            const config = typeConfig[type] || typeConfig.story;
            const count = writings.filter((w: Writing) => w.type === type).length;
            return (
              <Button
                key={type}
                variant={typeFilter === type ? "primary" : "secondary"}
                size="sm"
                className={`rounded-full text-xs ${
                  typeFilter !== type ? `${config.bg} ${config.color}` : ""
                }`}
                onClick={() => setTypeFilter(typeFilter === type ? null : type)}
              >
                {config.label} ({count})
              </Button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-violet-50 to-primary-50 rounded-2xl">
          <div className="text-5xl mb-4" aria-hidden="true">
            ✍️
          </div>
          <p className="text-lg font-medium text-slate-700">
            Stories, poems & random thoughts
          </p>
          <p className="text-sm text-slate-500 mt-1">
            dropping soon. Watch this space!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((writing: Writing, index: number) => {
            const config = typeConfig[writing.type] || typeConfig.story;
            const Icon = config.icon;
            const isExpanded = expandedId === writing._id;
            const preview = isExpanded
              ? writing.content
              : writing.content.slice(0, 200) + "...";

            return (
              <motion.div
                key={writing._id}
                className="card p-6 hover:shadow-md hover:border-violet-200 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-primary-100 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                  {writing.createdAt && (
                    <span className="text-xs text-slate-500 ml-auto">
                      {new Date(writing.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">
                  {writing.title}
                </h3>
                <p className="text-sm text-slate-600 italic leading-relaxed whitespace-pre-wrap">
                  {preview}
                </p>
                {writing.content.length > 200 && (
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : writing._id)
                    }
                    className="text-xs text-primary-500 mt-2 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 rounded"
                  >
                    {isExpanded ? "Show less ↑" : "Read more →"}
                  </button>
                )}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <ReactionBar targetType="writing" targetId={writing._id} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicWritings;
