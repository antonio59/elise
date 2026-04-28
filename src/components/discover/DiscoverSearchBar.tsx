import React from "react";
import { Compass, Heart, X, TrendingUp } from "lucide-react";

interface DiscoverSearchBarProps {
  stats?: { liked: number; passed: number; addedToWishlist: number };
  profile?: { topGenres: string[]; topMoods: string[] };
}

const DiscoverSearchBar: React.FC<DiscoverSearchBarProps> = ({
  stats,
  profile,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Discover</h1>
          <p className="text-sm text-slate-500">
            Swipe to find your next read
          </p>
        </div>
      </div>

      {stats && (stats.liked > 0 || stats.passed > 0) && (
        <div className="flex items-center gap-4 mt-4 px-4 py-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-1.5 text-sm">
            <Heart className="w-4 h-4 text-success-500" />
            <span className="font-medium text-slate-700">{stats.liked}</span>
            <span className="text-slate-400">liked</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <X className="w-4 h-4 text-error-400" />
            <span className="font-medium text-slate-700">{stats.passed}</span>
            <span className="text-slate-400">passed</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            <span className="font-medium text-slate-700">
              {stats.addedToWishlist}
            </span>
            <span className="text-slate-400">wishlisted</span>
          </div>
        </div>
      )}

      {profile && profile.topGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-slate-400 self-center">Based on:</span>
          {profile.topGenres.slice(0, 4).map((genre: string) => (
            <span
              key={genre}
              className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-medium"
            >
              {genre}
            </span>
          ))}
          {profile.topMoods.slice(0, 2).map((mood: string) => (
            <span
              key={mood}
              className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium"
            >
              {mood}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverSearchBar;
