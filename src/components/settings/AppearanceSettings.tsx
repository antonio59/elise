import React from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles, Heart } from "lucide-react";

const themes = [
  {
    value: "editorial",
    label: "Editorial",
    colors: ["#c4856c", "#102a43", "#faf8f5"],
    desc: "Warm beige & dusty rose",
  },
  {
    value: "sakura",
    label: "Sakura",
    colors: ["#f472b6", "#22d3ee", "#fafafa"],
    desc: "Pink & teal kawaii",
  },
  {
    value: "lavender",
    label: "Lavender",
    colors: ["#c084fc", "#2dd4bf", "#fafafa"],
    desc: "Soft purple & mint",
  },
  {
    value: "midnight",
    label: "Midnight",
    colors: ["#facc15", "#627d98", "#1a1f2e"],
    desc: "Dark navy & gold",
  },
  {
    value: "sunset",
    label: "Sunset",
    colors: ["#fb923c", "#f87171", "#fffbf5"],
    desc: "Warm coral & gold",
  },
  {
    value: "botanical",
    label: "Botanical",
    colors: ["#4ade80", "#facc15", "#faf9f7"],
    desc: "Sage green & earth",
  },
  {
    value: "berry",
    label: "Berry",
    colors: ["#f472b6", "#c084fc", "#fafafa"],
    desc: "Raspberry & plum",
  },
];

interface AppearanceSettingsProps {
  theme: string;
  setTheme: (theme: string) => void;
  heroTitle: string;
  setHeroTitle: (title: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (subtitle: string) => void;
  footerTagline: string;
  setFooterTagline: (tagline: string) => void;
  footerNote: string;
  setFooterNote: (note: string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  theme,
  setTheme,
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  footerTagline,
  setFooterTagline,
  footerNote,
  setFooterNote,
}) => {
  return (
    <>
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Appearance</h2>
            <p className="text-sm text-slate-500">
              Customize how things look
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  theme === t.value
                    ? "border-primary-400 bg-primary-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex gap-1.5 mb-2">
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-slate-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="font-medium text-sm text-slate-800">{t.label}</div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Theme applies to the public homepage and your dashboard
          </p>
        </div>
      </motion.div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-primary-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Homepage Hero</h2>
            <p className="text-sm text-slate-500">Customize what visitors see first</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Site Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="input"
              placeholder="Elise Reads"
            />
            <p className="text-xs text-slate-500 mt-1">The big heading on your homepage</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="input"
              placeholder="books I've read, art I make, and words I write"
            />
            <p className="text-xs text-slate-500 mt-1">The italic subtitle under your title</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-primary-50 to-violet-50 rounded-xl">
            <p className="text-xs text-slate-500 font-medium mb-2">Preview:</p>
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">
                {heroTitle || "Elise Reads"}
              </span>
            </h2>
            <p className="text-base text-slate-500 italic mt-1">
              {heroSubtitle || "books I've read, art I make, and words I write"}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-violet-400 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Footer</h2>
            <p className="text-sm text-slate-500">Customise what's at the bottom</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={footerTagline}
              onChange={(e) => setFooterTagline(e.target.value)}
              className="input"
              placeholder="books I've read, art I make, and words I write"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Note</label>
            <input
              type="text"
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              className="input"
              placeholder="Made with love for Elise 💜"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AppearanceSettings;
