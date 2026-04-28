import React from "react";
import { Sparkles } from "lucide-react";

interface GalleryEmptyStateProps {
  message?: string;
}

const GalleryEmptyState: React.FC<GalleryEmptyStateProps> = ({
  message = "No items yet. Check back soon!",
}) => {
  return (
    <div className="text-center py-20 bg-slate-50 rounded-2xl">
      <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-500">{message}</p>
    </div>
  );
};

export default GalleryEmptyState;
