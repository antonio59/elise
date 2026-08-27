import React from "react";
import { Link } from "react-router-dom";
import { Feather, Palette, Camera, ArrowRight } from "lucide-react";

const cardDefs = [
  {
    key: "writing" as const,
    icon: Feather,
    label: "Writing",
    tagline: "stories, poems & journal entries",
    to: "/writing",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    linkColor: "text-violet-600 hover:text-violet-700",
  },
  {
    key: "art" as const,
    icon: Palette,
    label: "Art",
    tagline: "doodles, sketches & creations",
    to: "/art",
    bg: "from-primary-50 to-rose-50",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    border: "border-primary-100",
    linkColor: "text-primary-600 hover:text-primary-700",
  },
  {
    key: "photos" as const,
    icon: Camera,
    label: "Photos",
    tagline: "moments I want to remember",
    to: "/photos",
    bg: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    border: "border-teal-100",
    linkColor: "text-teal-600 hover:text-teal-700",
  },
];

export type FeaturedArtVisibility = {
  writing?: boolean;
  art?: boolean;
  photos?: boolean;
};

const FeaturedArt: React.FC<{ visible?: FeaturedArtVisibility }> = ({
  visible,
}) => {
  const cards = cardDefs.filter((card) => visible?.[card.key] !== false);

  if (cards.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-violet-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            More than just books
          </h2>
          <p className="text-slate-500">Stuff I make outside the shelf</p>
        </div>

        <div
          className={`grid gap-6 ${
            cards.length === 1
              ? "md:grid-cols-1 max-w-md mx-auto"
              : cards.length === 2
                ? "md:grid-cols-2 max-w-3xl mx-auto"
                : "md:grid-cols-3"
          }`}
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.to}
                className={`group relative bg-gradient-to-br ${card.bg} rounded-2xl p-8 border ${card.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center overflow-hidden min-h-[44px]`}
              >
                <div
                  className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}
                >
                  <Icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {card.label}
                </h3>
                <p className="text-sm text-slate-500 italic mb-4">
                  {card.tagline}
                </p>

                <span
                  className={`inline-flex items-center gap-1 text-sm font-semibold min-h-11 ${card.linkColor} transition-colors`}
                >
                  Explore
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArt;
