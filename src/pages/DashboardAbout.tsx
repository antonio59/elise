import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Camera,
  Loader2,
  BookOpen,
  Heart,
  Quote,
  Sparkles,
  BookMarked,
  User,
  Shuffle,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const GENRES = [
  "Manga", "Manhwa", "Webtoon", "Light Novel", "Fantasy", "Sci-Fi",
  "Romance", "Mystery", "Horror", "Slice of Life", "Action", "Comedy", "Drama",
];

const DashboardAbout: React.FC = () => {
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateAvatarUploadUrl);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [favoriteBook, setFavoriteBook] = useState("");
  const [rereads, setRereads] = useState("");
  const [favoriteQuote, setFavoriteQuote] = useState("");
  const [funFact, setFunFact] = useState("");
  const [currentlyReading, setCurrentlyReading] = useState("");

  // Populate from profile
  React.useEffect(() => {
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
        rereads: rereads
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      await updateProfile({ avatarStorageId: storageId });
    } finally {
      setUploading(false);
    }
  };

  // Generate a random DiceBear avatar
  const generateAvatar = async () => {
    setUploading(true);
    try {
      const seed = Math.random().toString(36).substring(2, 10);
      const response = await fetch(`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`);
      const svg = await response.text();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const file = new File([blob], "avatar.svg", { type: "image/svg+xml" });
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await updateProfile({ avatarStorageId: storageId });
    } catch (err) {
      console.error("Avatar generation failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = profile?.avatarStorageId
    ? `https://agile-shrimp-456.convex.cloud/api/storage/${profile.avatarStorageId}`
    : profile?.avatarUrl || undefined;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Edit About Page</h1>
        <p className="text-slate-500 text-sm mt-1">
          This shows on your public <a href="/about" target="_blank" className="text-primary-500 hover:underline">/about</a> page
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar + Name */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            Profile
          </h2>
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-accent-200 text-2xl">
                    👧
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50"
                title="Upload photo"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-slate-500" />
                )}
              </button>
              <button
                onClick={generateAvatar}
                disabled={uploading}
                className="absolute -bottom-2 right-6 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50"
                title="Generate random avatar"
              >
                <Shuffle className="w-4 h-4 text-primary-500" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-600 mb-1 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Your name"
              />
              <label className="text-sm font-medium text-slate-600 mb-1 mt-3 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input h-24 resize-none"
                placeholder="Tell people about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Reading Stats */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            Reading
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Reading Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="input"
                placeholder="e.g. Read 30 books in 2026"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Currently Reading
              </label>
              <input
                type="text"
                value={currentlyReading}
                onChange={(e) => setCurrentlyReading(e.target.value)}
                className="input"
                placeholder="e.g. Harry Potter and the Chamber of Secrets"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Favourite Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() =>
                      setGenres((prev) =>
                        prev.includes(genre)
                          ? prev.filter((g) => g !== genre)
                          : [...prev, genre]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      genres.includes(genre)
                        ? "bg-primary-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Favourites */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Favourites
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <BookMarked className="w-4 h-4" />
                Favourite Book of All Time
              </label>
              <input
                type="text"
                value={favoriteBook}
                onChange={(e) => setFavoriteBook(e.target.value)}
                className="input"
                placeholder="e.g. The Hunger Games by Suzanne Collins"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Books I've Read More Than Once
              </label>
              <input
                type="text"
                value={rereads}
                onChange={(e) => setRereads(e.target.value)}
                className="input"
                placeholder="e.g. Harry Potter, The Hobbit, Matilda"
              />
              <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
            </div>
          </div>
        </div>

        {/* Personal Touches */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Personal Touches
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <Quote className="w-4 h-4" />
                Favourite Quote
              </label>
              <textarea
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                className="input h-20 resize-none"
                placeholder="A quote that means something to you..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Fun Fact About Me
              </label>
              <input
                type="text"
                value={funFact}
                onChange={(e) => setFunFact(e.target.value)}
                className="input"
                placeholder="e.g. I once read 5 books in one week!"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
          {saved && (
            <motion.span
              className="text-sm text-green-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              ✓ Saved
            </motion.span>
          )}
          <a
            href="/about"
            target="_blank"
            className="text-sm text-slate-500 hover:text-slate-700 ml-auto"
          >
            Preview public page →
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardAbout;
