import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Check,
  X,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

const GENRES = [
  "Manga", "Manhwa", "Webtoon", "Light Novel", "Fantasy", "Sci-Fi",
  "Romance", "Mystery", "Horror", "Slice of Life", "Action", "Comedy", "Drama",
];

const AVATAR_STYLES = [
  { id: "fun-emoji", label: "Fun Emoji", desc: "Colorful emoji-style faces" },
  { id: "adventurer", label: "Adventurer", desc: "Bold character art" },
  { id: "lorelei", label: "Lorelei", desc: "Elegant illustrated portraits" },
  { id: "micah", label: "Micah", desc: "Clean minimal avatars" },
  { id: "miniavs", label: "Mini Avatars", desc: "Cute mini characters" },
  { id: "notionists", label: "Notionists", desc: "Playful doodle style" },
  { id: "open-peeps", label: "Open Peeps", desc: "Hand-drawn people" },
  { id: "personas", label: "Personas", desc: "Stylish illustrated heads" },
  { id: "pixel-art", label: "Pixel Art", desc: "Retro pixel characters" },
  { id: "thumbs", label: "Thumbs", desc: "Quirky thumb-shaped avatars" },
  { id: "croodles", label: "Croodles", desc: "Scribbly doodle faces" },
  { id: "big-ears", label: "Big Ears", desc: "Adorable big-eared creatures" },
  { id: "bottts", label: "Robots", desc: "Cute robot avatars" },
];

const DashboardAbout: React.FC = () => {
  usePageAnnouncement("About Page");
  usePageMeta({ title: "About Page", description: "Edit your about page" });
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateAvatarUploadUrl);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Avatar creator state
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("fun-emoji");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const randomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setPreviewUrl(`https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${newSeed}&size=200`);
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
    const newSeed = Math.random().toString(36).substring(2, 10);
    setPreviewUrl(`https://api.dicebear.com/9.x/${styleId}/svg?seed=${newSeed}&size=200`);
  };

  const saveAvatar = async () => {
    if (!previewUrl) return;
    setUploading(true);
    try {
      // Fetch SVG and upload to Convex storage
      const response = await fetch(previewUrl);
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
      setShowAvatarCreator(false);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Avatar save failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = profile?.avatarStorageId
    ? `https://${import.meta.env.VITE_CONVEX_URL?.replace(/^https?:\/\//, "").replace(/\/$/, "")}/api/storage/${profile.avatarStorageId}`
    : profile?.avatarUrl || undefined;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Edit About Page</h1>
        <p className="text-slate-500 text-sm mt-1">
          This shows on your public <a href="/about" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">/about</a> page
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
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-accent-200 text-2xl">
                    👧
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAvatarCreator(true)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 border border-slate-200"
                title="Create avatar"
              >
                <Sparkles className="w-4 h-4 text-violet-500" />
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 right-6 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 border border-slate-200"
                title="Upload photo"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-slate-500" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium text-slate-600 mb-1 block">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
              <label className="text-sm font-medium text-slate-600 mb-1 mt-3 block">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input h-24 resize-none" placeholder="Tell people about yourself..." />
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
              <label className="text-sm font-medium text-slate-600 mb-1 block">Reading Goal</label>
              <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} className="input" placeholder="e.g. Read 30 books in 2026" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">Currently Reading</label>
              <input type="text" value={currentlyReading} onChange={(e) => setCurrentlyReading(e.target.value)} className="input" placeholder="e.g. Harry Potter and the Chamber of Secrets" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">Favourite Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre])}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      genres.includes(genre) ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              <input type="text" value={favoriteBook} onChange={(e) => setFavoriteBook(e.target.value)} className="input" placeholder="e.g. The Hunger Games by Suzanne Collins" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Books I've Read More Than Once
              </label>
              <input type="text" value={rereads} onChange={(e) => setRereads(e.target.value)} className="input" placeholder="e.g. Harry Potter, The Hobbit, Matilda" />
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
              <textarea value={favoriteQuote} onChange={(e) => setFavoriteQuote(e.target.value)} className="input h-20 resize-none" placeholder="A quote that means something to you..." />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">Fun Fact About Me</label>
              <input type="text" value={funFact} onChange={(e) => setFunFact(e.target.value)} className="input" placeholder="e.g. I once read 5 books in one week!" />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
          {saved && <motion.span className="text-sm text-green-600" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>✓ Saved</motion.span>}
          <a href="/about" target="_blank" className="text-sm text-slate-500 hover:text-slate-700 ml-auto">Preview public page →</a>
        </div>
      </div>

      {/* Avatar Creator Modal */}
      <AnimatePresence>
        {showAvatarCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => { setShowAvatarCreator(false); setPreviewUrl(null); }}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Create Your Avatar ✨</h2>
                    <p className="text-sm text-slate-500">Pick a style, then keep shuffling until you love it</p>
                  </div>
                  <button onClick={() => { setShowAvatarCreator(false); setPreviewUrl(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Preview */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-violet-50 border-2 border-slate-200 mb-4">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">👧</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={randomizeAvatar} className="btn btn-secondary text-sm">
                      <Shuffle className="w-4 h-4" /> Shuffle
                    </button>
                    {previewUrl && (
                      <button onClick={saveAvatar} disabled={uploading} className="btn btn-primary text-sm">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Use This
                      </button>
                    )}
                  </div>
                </div>

                {/* Style Grid */}
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-3">Choose a style:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {AVATAR_STYLES.map((style) => {
                      const isSelected = selectedStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => handleStyleChange(style.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-primary-400 bg-primary-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                              <img
                                src={`https://api.dicebear.com/9.x/${style.id}/svg?seed=elise&size=40`}
                                alt={style.label}
                                className="w-full h-full"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-800">{style.label}</p>
                              <p className="text-xs text-slate-400">{style.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardAbout;
