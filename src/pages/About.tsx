import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  User,
  Edit3,
  Save,
  Camera,
  Loader2,
  Target,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";
import type { Id } from "../../convex/_generated/dataModel";

const GENRES = [
  "Manga",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Horror",
  "Contemporary",
  "Historical",
  "Thriller",
  "Poetry",
  "Graphic Novel",
  "Non-Fiction",
];

const About: React.FC = () => {
  const { user } = useAuth();
  const profile = useQuery(api.users.getPublicProfile);
  const ownProfile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateAvatarUploadUrl);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Populate edit form from own profile
  React.useEffect(() => {
    if (ownProfile && editing) {
      setName(ownProfile.name || "");
      setBio(ownProfile.bio || "");
      setGenres(ownProfile.favoriteGenres || []);
      setGoal(ownProfile.readingGoal || "");
    }
  }, [ownProfile, editing]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await updateProfile({ avatarStorageId: storageId as Id<"_storage"> });
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name,
        bio,
        favoriteGenres: genres,
        readingGoal: goal || undefined,
      });
      setEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const isOwner = !!user;

  if (!profile && !ownProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  // Display data: use public profile for viewing, own profile for editing
  const display = editing ? ownProfile : profile;
  if (!display) return null;

  const currentlyReading = !editing && profile?.currentlyReading ? profile.currentlyReading : null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">About</h1>
            {isOwner && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-secondary text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {/* Profile Card */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative self-center sm:self-start">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-50 flex items-center justify-center">
                  {display.avatarUrl ? (
                    <img
                      src={display.avatarUrl}
                      alt={display.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary-300" />
                  )}
                </div>
                {isOwner && editing && (
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      ) : (
                        <Camera className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="input min-h-[80px] resize-y"
                        placeholder="A few words about yourself..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Reading Goal</label>
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="input"
                        placeholder="e.g. Read 50 books this year"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-800">{display.name}</h2>
                    {display.username && (
                      <p className="text-sm text-slate-400">@{display.username}</p>
                    )}
                    {display.bio ? (
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{display.bio}</p>
                    ) : isOwner ? (
                      <p className="text-sm text-slate-400 mt-3 italic">
                        Add a bio to tell people about yourself.
                      </p>
                    ) : null}
                    {display.readingGoal && (
                      <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                        <Target className="w-4 h-4 text-primary-400" />
                        {display.readingGoal}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Favourite Genres */}
          <div className="card p-6 mb-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
              Favourite Genres
            </h3>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      genres.includes(genre)
                        ? "bg-primary-400 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            ) : display.favoriteGenres && display.favoriteGenres.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {display.favoriteGenres.map((genre) => (
                  <span key={genre} className="badge badge-primary">
                    {genre}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">
                {isOwner ? "Add your favourite genres." : "No genres added yet."}
              </p>
            )}
          </div>

          {/* Currently Reading */}
          {currentlyReading && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                Currently Reading
              </h3>
              <div className="flex gap-4">
                <div className="w-16 h-24 rounded-lg overflow-hidden bg-primary-50 flex-shrink-0">
                  {currentlyReading.coverUrl ? (
                    <img
                      src={currentlyReading.coverUrl}
                      alt={currentlyReading.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-300" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{currentlyReading.title}</p>
                  <p className="text-sm text-slate-500">{currentlyReading.author}</p>
                  {currentlyReading.pageCount && currentlyReading.pagesRead != null && (
                    <div className="mt-2">
                      <div className="xp-bar">
                        <div
                          className="xp-bar-fill"
                          style={{
                            width: `${Math.round(
                              (currentlyReading.pagesRead / currentlyReading.pageCount) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {currentlyReading.pagesRead} / {currentlyReading.pageCount} pages
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit actions */}
          {editing && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
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
                    Save
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
