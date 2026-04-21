import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TrendingUp } from "lucide-react";

const ArtProgressTimeline: React.FC = () => {
  const artworks = useQuery(api.artworks.getMyArtworks) ?? [];

  const sorted = [...artworks].sort((a, b) => a.createdAt - b.createdAt);
  const first = sorted[0];
  const latest = sorted[sorted.length - 1];

  if (sorted.length < 2) return null;

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-teal-500 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Art Journey</h3>
          <p className="text-sm text-slate-500">From your first piece to now</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {first && (
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">First Piece</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img src={first.imageUrl} alt={first.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-medium text-slate-700 mt-2">{first.title}</p>
            <p className="text-xs text-slate-400">{new Date(first.createdAt).toLocaleDateString()}</p>
          </div>
        )}
        {latest && (
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Latest Piece</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img src={latest.imageUrl} alt={latest.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-medium text-slate-700 mt-2">{latest.title}</p>
            <p className="text-xs text-slate-400">{new Date(latest.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-accent-600">{sorted.length}</span> artworks over{" "}
          <span className="font-bold text-accent-600">
            {Math.max(1, Math.round((latest.createdAt - first.createdAt) / (1000 * 60 * 60 * 24)))}
          </span>{" "}
          days
        </p>
      </div>
    </motion.div>
  );
};

export default ArtProgressTimeline;
