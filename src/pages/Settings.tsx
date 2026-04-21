import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Save,
  Loader2,
  Palette,
  Bell,
  Target,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Heart,
  Moon,
  Sun,
  Leaf,
  Sunset,
  Cherry,
  Droplets,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

type ThemeValue =
  | "editorial"
  | "sakura"
  | "lavender"
  | "midnight"
  | "sunset"
  | "botanical"
  | "berry"
  | "light"
  | "dark"
  | "kawaii";

interface SiteSettings {
  siteName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  footerTagline?: string;
  footerNote?: string;
}

const VALID_THEMES: ThemeValue[] = [
  "editorial",
  "sakura",
  "lavender",
  "midnight",
  "sunset",
  "botanical",
  "berry",
  "light",
  "dark",
  "kawaii",
];

const Settings: React.FC = () => {
  usePageAnnouncement("Settings");
  usePageMeta({ title: "Settings", description: "Profile settings" });
  const { user } = useAuth();
  const siteSettings = useQuery(api.siteSettings.get);
  const updateSiteSettings = useMutation(api.siteSettings.update);
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState<string>("editorial");
  const [yearlyBookGoal, setYearlyBookGoal] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [footerTagline, setFooterTagline] = useState("");
  const [footerNote, setFooterNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setTheme(profile.theme || "kawaii");
      setYearlyBookGoal(profile.yearlyBookGoal?.toString() || "");
      setNotifications(profile.notifications ?? true);
    }
  }, [profile]);

  useEffect(() => {
    if (siteSettings) {
      const s = siteSettings as SiteSettings;
      setHeroTitle(s.heroTitle || "");
      setHeroSubtitle(s.heroSubtitle || "");
      setFooterTagline(s.footerTagline || "");
      setFooterNote(s.footerNote || "");
    }
  }, [siteSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError("");

    try {
      await updateProfile({
        name: name.trim() || undefined,
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        theme: VALID_THEMES.includes(theme as ThemeValue) ? (theme as ThemeValue) : undefined,
        yearlyBookGoal: yearlyBookGoal ? parseInt(yearlyBookGoal) : undefined,
        notifications,
      });
      await updateSiteSettings({
        heroTitle: heroTitle.trim() || undefined,
        heroSubtitle: heroSubtitle.trim() || undefined,
        footerTagline: footerTagline.trim() || undefined,
        footerNote: footerNote.trim() || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    {
      value: "editorial",
      label: "Editorial",
      icon: Sun,
      colors: ["#c4856c", "#102a43", "#faf8f5"],
      desc: "Warm beige & dusty rose",
    },
    {
      value: "sakura",
      label: "Sakura",
      icon: Cherry,
      colors: ["#f472b6", "#22d3ee", "#fafafa"],
      desc: "Pink & teal kawaii",
    },
    {
      value: "lavender",
      label: "Lavender",
      icon: Droplets,
      colors: ["#c084fc", "#2dd4bf", "#fafafa"],
      desc: "Soft purple & mint",
    },
    {
      value: "midnight",
      label: "Midnight",
      icon: Moon,
      colors: ["#facc15", "#627d98", "#1a1f2e"],
      desc: "Dark navy & gold",
    },
    {
      value: "sunset",
      label: "Sunset",
      icon: Sunset,
      colors: ["#fb923c", "#f87171", "#fffbf5"],
      desc: "Warm coral & gold",
    },
    {
      value: "botanical",
      label: "Botanical",
      icon: Leaf,
      colors: ["#4ade80", "#facc15", "#faf9f7"],
      desc: "Sage green & earth",
    },
    {
      value: "berry",
      label: "Berry",
      icon: Sparkles,
      colors: ["#f472b6", "#c084fc", "#fafafa"],
      desc: "Raspberry & plum",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Profile</h2>
              <p className="text-sm text-slate-500">Your public information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input"
                rows={3}
                placeholder="Tell visitors a bit about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                className="input bg-slate-50"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Theme Section */}
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

        {/* Hero Settings Section */}
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

        {/* Footer Settings Section */}
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

        {/* Reading Goals Section */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Reading Goals</h2>
              <p className="text-sm text-slate-500">Set your yearly targets</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Yearly Book Goal
            </label>
            <input
              type="number"
              value={yearlyBookGoal}
              onChange={(e) => setYearlyBookGoal(e.target.value)}
              className="input"
              placeholder="e.g., 24"
              min="1"
            />
            <p className="text-xs text-slate-500 mt-1">
              How many books do you want to read each year?
            </p>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Notifications</h2>
              <p className="text-sm text-slate-500">Manage your alerts</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-800">Email Notifications</p>
              <p className="text-sm text-slate-500">
                Get notified about new book suggestions
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              onClick={() => setNotifications(!notifications)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setNotifications(!notifications);
                }
              }}
              className={`w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${
                notifications ? "bg-primary-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>

          {saved && (
            <motion.div
              className="flex items-center gap-2 text-green-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Changes saved!</span>
            </motion.div>
          )}
          {saveError && (
            <motion.div
              className="flex items-center gap-2 text-red-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium text-sm">{saveError}</span>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Settings;
