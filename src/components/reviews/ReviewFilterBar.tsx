import React from "react";
import { BookOpen, Heart, Star, ChevronDown } from "lucide-react";

type FilterType = "all" | "favorites" | "5star" | "4star";
type SortType = "recent" | "rating" | "title";

interface ReviewFilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
}

const ReviewFilterBar: React.FC<ReviewFilterBarProps> = ({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { key: "all" as FilterType, label: "All", icon: BookOpen },
        { key: "favorites" as FilterType, label: "Favorites", icon: Heart },
        { key: "5star" as FilterType, label: "5-Star", icon: Star },
        { key: "4star" as FilterType, label: "4-Star", icon: Star },
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === key
              ? "bg-primary-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}

      <div className="flex-1" />

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="appearance-none bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1.5 pr-7 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
        >
          <option value="recent">Recent</option>
          <option value="rating">Highest Rated</option>
          <option value="title">A–Z</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default ReviewFilterBar;
