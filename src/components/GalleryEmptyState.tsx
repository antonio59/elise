import React from "react";
import { Sparkles } from "lucide-react";

interface GalleryEmptyStateProps {
  message?: string;
  hint?: string;
}

const GalleryEmptyState: React.FC<GalleryEmptyStateProps> = ({
  message = "Nothing here yet",
  hint = "New pieces will show up here when they're ready to share.",
}) => {
  return (
    <div className="text-center py-20 px-4 bg-slate-50 rounded-2xl">
      <Sparkles className="w-12 h-12 text-primary-300 mx-auto mb-4" />
      <p className="text-slate-700 font-medium mb-1">{message}</p>
      <p className="text-slate-500 text-sm max-w-sm mx-auto">{hint}</p>
    </div>
  );
};

export default GalleryEmptyState;
