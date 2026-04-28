import { Eye, EyeOff } from "lucide-react";

interface GalleryFilterTabsProps {
  filter: "all" | "published" | "drafts";
  onChange: (filter: "all" | "published" | "drafts") => void;
  counts: {
    all: number;
    published: number;
    drafts: number;
  };
  labels?: {
    all?: string;
    published?: string;
    drafts?: string;
  };
}

export default function GalleryFilterTabs({
  filter,
  onChange,
  counts,
  labels = {},
}: GalleryFilterTabsProps) {
  const {
    all = "All",
    published = "Published",
    drafts = "Drafts",
  } = labels;

  const tabs: {
    key: "all" | "published" | "drafts";
    label: string;
    count: number;
    icon?: React.ReactNode;
    activeClass: string;
  }[] = [
    {
      key: "all",
      label: all,
      count: counts.all,
      activeClass: "bg-accent-100 text-accent-700",
    },
    {
      key: "published",
      label: published,
      count: counts.published,
      icon: <Eye className="w-4 h-4" />,
      activeClass: "bg-success-100 text-success-700",
    },
    {
      key: "drafts",
      label: drafts,
      count: counts.drafts,
      icon: <EyeOff className="w-4 h-4" />,
      activeClass: "bg-slate-200 text-slate-700",
    },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            filter === tab.key
              ? tab.activeClass
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab.icon}
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}
