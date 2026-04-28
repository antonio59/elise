import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import ProfileHeader from "../components/about/ProfileHeader";
import BioEditor from "../components/about/BioEditor";
import StatsRow from "../components/about/StatsRow";
import FavoriteBookCard from "../components/about/FavoriteBookCard";
import SocialLinks from "../components/about/SocialLinks";
import AvatarCreatorModal from "../components/about/AvatarCreatorModal";

const DashboardAbout: React.FC = () => {
  usePageAnnouncement("About Page");
  usePageMeta({ title: "About Page", description: "Edit your about page" });
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateAvatarUploadUrl);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [favoriteBook, setFavoriteBook] = useState("");
  const [rereads, setRereads] = useState("");
  const [favoriteQuote, setFavoriteQuote] = useState("");
  const [funFact, setFunFact] = useState("");
  const [currentlyReading, setCurrentlyReading] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setGenres(profile.favoriteGenres || []);
      setGoal(profile.readingGoal || "");
      setFavoriteBook(profile.favoriteBook || "");
      setRereads((profile.rereads || []).join(", "));
      setFavoriteQuote(profile.favoriteQuote || "");
      setFunFact(profile.funFact || "");
      setCurrentlyReading(profile.currentlyReading || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim() || undefined,
        favoriteGenres: genres,
        readingGoal: goal.trim() || undefined,
        favoriteBook: favoriteBook.trim() || undefined,
        rereads: rereads.split(",").map((s) => s.trim()).filter(Boolean),
        favoriteQuote: favoriteQuote.trim() || undefined,
        funFact: funFact.trim() || undefined,
        currentlyReading: currentlyReading.trim() || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = profile?.avatarStorageId
    ? `https://${import.meta.env.VITE_CONVEX_URL?.replace(/^https?:\/\//, "").replace(/\/$/, "")}/api/storage/${profile.avatarStorageId}`
    : profile?.avatarUrl || undefined;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Edit About Page</h1>
        <p className="text-slate-500 text-sm mt-1">
          This shows on your public <a href="/about" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">/about</a> page
        </p>
      </div>

      <div className="space-y-6">
        <ProfileHeader
          avatarUrl={avatarUrl} name={name} setName={setName}
          updateProfile={updateProfile} generateUploadUrl={generateUploadUrl}
          onOpenAvatarCreator={() => setShowAvatarCreator(true)}
        />
        <BioEditor bio={bio} setBio={setBio} />
        <StatsRow
          goal={goal} setGoal={setGoal}
          currentlyReading={currentlyReading} setCurrentlyReading={setCurrentlyReading}
          genres={genres} setGenres={setGenres}
        />
        <FavoriteBookCard
          favoriteBook={favoriteBook} setFavoriteBook={setFavoriteBook}
          rereads={rereads} setRereads={setRereads}
        />
        <SocialLinks
          favoriteQuote={favoriteQuote} setFavoriteQuote={setFavoriteQuote}
          funFact={funFact} setFunFact={setFunFact}
        />

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
          {saved && <motion.span className="text-sm text-success-600" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>✓ Saved</motion.span>}
          <a href="/about" target="_blank" className="text-sm text-slate-500 hover:text-slate-700 ml-auto">Preview public page →</a>
        </div>
      </div>

      <AnimatePresence>
        <AvatarCreatorModal
          show={showAvatarCreator}
          onClose={() => setShowAvatarCreator(false)}
          updateProfile={updateProfile}
          generateUploadUrl={generateUploadUrl}
        />
      </AnimatePresence>
    </div>
  );
};

export default DashboardAbout;
