import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { type ThemeValue, type SiteSettings, VALID_THEMES } from "../components/settings/types";
import ProfileSettings from "../components/settings/ProfileSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AccountSettings from "../components/settings/AccountSettings";
import SettingsTabs from "../components/settings/SettingsTabs";
import SaveControls from "../components/settings/SaveControls";

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <SettingsTabs>
          <ProfileSettings bio={bio} setBio={setBio} email={user?.email} />
          <AppearanceSettings
            theme={theme} setTheme={setTheme}
            heroTitle={heroTitle} setHeroTitle={setHeroTitle}
            heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle}
            footerTagline={footerTagline} setFooterTagline={setFooterTagline}
            footerNote={footerNote} setFooterNote={setFooterNote}
          />
          <AccountSettings yearlyBookGoal={yearlyBookGoal} setYearlyBookGoal={setYearlyBookGoal} />
          <NotificationSettings notifications={notifications} setNotifications={setNotifications} />
        </SettingsTabs>
        <SaveControls saving={saving} saved={saved} saveError={saveError} />
      </form>
    </div>
  );
};

export default Settings;
