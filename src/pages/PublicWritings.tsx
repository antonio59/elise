/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Feather, BookHeart, BookOpenText, ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";

const PublicWritings: React.FC = () => {
  const writings = useQuery(api.writings.getPublished, { limit: 20 }) ?? [];
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const typeConfig: Record<string, { icon: typeof Feather; color: string; label: string; bg: string }> = {
    poetry: { icon: Feather, color: "text-violet-500", label: "Poetry", bg: "bg-violet-50" },
    story: { icon: BookHeart, color: "text-primary-500", label: "Story", bg: "bg-primary-50" },
    journal: { icon: BookOpenText, color: "text-accent-500", label: "Journal", bg: "bg-accent-50" },
  };

  const types = Array.from(new Set(writings.map((w: any) => w.type)));

  const filtered = writings.filter((w: any) => !typeFilter || w.type === typeFilter);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">Creative Writing</span>
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">Words & Worlds</span>
        </h1>
        <p className="text-slate-500 mt-1">stories, poems, and thoughts</p>
      </div>

      {/* Category Filter */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setTypeFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !typeFilter ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {types.map((type: string) => {
            const config = typeConfig[type] || typeConfig.story;
            const count = writings.filter((w: any) => w.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  typeFilter === type ? "bg-primary-500 text-white" : `${config.bg} ${config.color}`
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-violet-50 to-primary-50 rounded-2xl">
          <div className="text-5xl mb-4">✍️</div>
          <p className="text-lg font-medium text-slate-700">Stories, poems & random thoughts</p>
          <p className="text-sm text-slate-400 mt-1">dropping soon. Watch this space!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((writing: any, index: number) => {
            const config = typeConfig[writing.type] || typeConfig.story;
            const Icon = config.icon;
            const preview = writing.content.slice(0, 200) + "...";

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
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-primary-100 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                  {writing.createdAt && (
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(writing.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{writing.title}</h3>
                <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-4">{preview}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicWritings;
