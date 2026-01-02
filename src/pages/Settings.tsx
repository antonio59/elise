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
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "kawaii">("kawaii");
  const [yearlyBookGoal, setYearlyBookGoal] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await updateProfile({
        name: name.trim() || undefined,
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        theme,
        yearlyBookGoal: yearlyBookGoal ? parseInt(yearlyBookGoal) : undefined,
        notifications,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    {
      value: "kawaii" as const,
      label: "Kawaii",
      color: "from-pink-400 to-violet-400",
    },
    {
      value: "light" as const,
      label: "Light",
      color: "from-slate-200 to-slate-300",
    },
    {
      value: "dark" as const,
      label: "Dark",
      color: "from-slate-700 to-slate-800",
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
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
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="@username"
              />
            </div>

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-accent-500 flex items-center justify-center">
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
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === t.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-full h-8 rounded-lg bg-gradient-to-r ${t.color} mb-2`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === t.value ? "text-primary-600" : "text-slate-600"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
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
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full transition-colors ${
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
        </div>
      </form>
    </div>
  );
};

export default Settings;
