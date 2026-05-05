import React from "react";
import { Link } from "react-router-dom";
import { Feather, Palette, Camera, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: Feather,
    label: "Writing",
    tagline: "stories, poems & journal entries",
    emoji: "✍️",
    to: "/writing",
    gradient: "from-violet-400 to-purple-500",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    linkColor: "text-violet-600 hover:text-violet-700",
  },
  {
    icon: Palette,
    label: "Art",
    tagline: "doodles, sketches & creations",
    emoji: "🎨",
    to: "/art",
    gradient: "from-primary-400 to-pink-400",
    bg: "from-primary-50 to-rose-50",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    border: "border-primary-100",
    linkColor: "text-primary-600 hover:text-primary-700",
  },
  {
    icon: Camera,
    label: "Photos",
    tagline: "moments I want to remember",
    emoji: "📸",
    to: "/photos",
    gradient: "from-teal-400 to-cyan-500",
    bg: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    border: "border-teal-100",
    linkColor: "text-teal-600 hover:text-teal-700",
  },
];

const FeaturedArt: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-violet-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            More than just books 🌟
          </h2>
          <p className="text-slate-500">
            I make stuff too — here's where you can find it
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.to}
                className={`group relative bg-gradient-to-br ${card.bg} rounded-2xl p-8 border ${card.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center overflow-hidden`}
              >
                {/* Background gradient blob on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}
                />

                <div
                  className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-8 h-8 ${card.iconColor}`} />
                </div>

                <div className="text-3xl mb-3">{card.emoji}</div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {card.label}
                </h3>
                <p className="text-sm text-slate-500 italic mb-4">
                  {card.tagline}
                </p>

                <span
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${card.linkColor} transition-colors`}
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
