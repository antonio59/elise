import React from "react";
import { motion } from "framer-motion";
import { Feather, BookHeart, BookOpenText, ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";

const PublicWritings: React.FC = () => {
  const writings = useQuery(api.writings.getPublished, { limit: 20 }) ?? [];

  const typeConfig: Record<string, { icon: typeof Feather; color: string; label: string }> = {
    poetry: { icon: Feather, color: "text-violet-500", label: "Poetry" },
    story: { icon: BookHeart, color: "text-primary-500", label: "Story" },
    journal: { icon: BookOpenText, color: "text-accent-500", label: "Journal" },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Writing</h1>
        <p className="text-slate-500 mt-1">stories, poems, and thoughts</p>
      </div>

      {writings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Feather className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Stories, poems & random thoughts — dropping soon. Watch this space! ✍️</p>
        </div>
      ) : (
        <div className="space-y-4">
          {writings.map((writing, index) => {
            const config = typeConfig[writing.type] || typeConfig.story;
            const Icon = config.icon;
            const preview = writing.content.slice(0, 200) + "...";

            return (
              <motion.div
                key={writing._id}
                className="card p-6 hover:border-violet-200 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-primary-100 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-500 capitalize">
                    {config.label}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{writing.title}</h3>
                <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-4">
                  {preview}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicWritings;
