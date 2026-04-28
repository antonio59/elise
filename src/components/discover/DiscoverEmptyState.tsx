import React from "react";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";

interface DiscoverEmptyStateProps {
  loading: boolean;
  onRefresh?: () => void;
}

const DiscoverEmptyState: React.FC<DiscoverEmptyStateProps> = ({
  loading,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-10 h-10 text-primary-400 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Finding books for you...</p>
        <p className="text-sm text-slate-400 mt-1">
          Analyzing your reading taste
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-violet-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-2">All caught up!</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">
        We've run out of recommendations for now. Refresh to discover more.
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="btn btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Find more books
        </button>
      )}
    </div>
  );
};

export default DiscoverEmptyState;
