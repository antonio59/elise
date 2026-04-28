import React from "react";
import { CheckCircle2, BookMarked, Heart } from "lucide-react";

type TabType = "read" | "reading" | "wishlist";

interface BookFilterBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    read: number;
    reading: number;
    wishlist: number;
  };
}

const BookFilterBar: React.FC<BookFilterBarProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs = [
    {
      key: "read" as TabType,
      label: "Finished",
      icon: CheckCircle2,
      count: counts.read,
      color: "text-success-600",
    },
    {
      key: "reading" as TabType,
      label: "Reading",
      icon: BookMarked,
      count: counts.reading,
      color: "text-accent-600",
    },
    {
      key: "wishlist" as TabType,
      label: "Wishlist",
      icon: Heart,
      count: counts.wishlist,
      color: "text-primary-600",
    },
  ];

  return (
    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${activeTab === tab.key ? "" : tab.color}`}
            />
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? "bg-white/20" : "bg-slate-100"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BookFilterBar;
