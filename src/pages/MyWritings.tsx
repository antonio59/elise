import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Plus,
  BookOpen,
  Feather,
  BookHeart,
  Star,
  Trash2,
  X,
  Loader2,
  Pencil,
  Heart,
  Eye,
  EyeOff,
  Globe,
  Smile,
} from "lucide-react";
import GiphyPicker from "../components/GiphyPicker";
import GenreSelect from "../components/GenreSelect";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

type WritingType = "poetry" | "story" | "journal";
type Writing = Doc<"writings">;

const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Horror",
  "Mystery",
  "Slice of Life",
  "Adventure",
  "Drama",
  "Comedy",
  "Fan Fiction",
  "Free Verse",
  "Haiku",
  "Other",
];

const TYPE_CONFIG: Record<WritingType, {
  label: string;
  icon: typeof Feather;
  color: string;
  gradient: string;
}> = {
  poetry: {
    label: "Poetry",
    icon: Feather,
    color: "text-violet-600",
    gradient: "from-violet-500 to-purple-600",
  },
  story: {
    label: "Short Stories",
    icon: BookHeart,
    color: "text-primary-600",
    gradient: "from-primary-500 to-rose-500",
  },
  journal: {
    label: "Journal",
    icon: BookOpen,
    color: "text-accent-600",
    gradient: "from-accent-500 to-cyan-500",
  },
};

const MyWritings: React.FC = () => {
  usePageAnnouncement("My Writing");
  usePageMeta({ title: "My Writing", description: "Manage your writing" });
  const [activeType, setActiveType] = useState<WritingType | "all">("all");
  const writings = useQuery(api.writings.getMyWritings, activeType === "all" ? {} : { type: activeType as WritingType }) ?? [];
  const stats = useQuery(api.writings.getStats);

  const createWriting = useMutation(api.writings.create);
  const updateWriting = useMutation(api.writings.update);
  const removeWriting = useMutation(api.writings.remove);
  const toggleFavorite = useMutation(api.writings.toggleFavorite);

  const [showEditor, setShowEditor] = useState(false);
  const [editingWriting, setEditingWriting] = useState<Writing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWritings = writings.filter((w: Writing) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (data: {
    title: string;
    content: string;
    type: WritingType;
    genre?: string;
    tags?: string[];
    isPublished: boolean;
  }) => {
    if (editingWriting) {
      await updateWriting({ id: editingWriting._id, ...data });
    } else {
      await createWriting(data);
    }
    setShowEditor(false);
    setEditingWriting(null);
  };

  const handleDelete = async (id: Id<"writings">) => {
    if (confirm("Delete this piece?")) {
      await removeWriting({ id });
    }
  };

  const typeTabs = [
    { key: "all" as const, label: "All", count: stats?.total ?? 0 },
    { key: "poetry" as const, label: "Poetry", count: stats?.poems ?? 0 },
    { key: "story" as const, label: "Stories", count: stats?.stories ?? 0 },
    { key: "journal" as const, label: "Journal", count: stats?.journals ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Writing ✍️</h1>
          <p className="text-slate-500 mt-1">
            {stats?.totalWords?.toLocaleString() ?? 0} words written
          </p>
        </div>
        <button
          onClick={() => { setShowEditor(true); setEditingWriting(null); }}
          className="btn btn-gradient"
        >
          <Plus className="w-5 h-5" />
          New Piece
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(["poetry", "story", "journal"] as WritingType[]).map((type) => {
          const config = TYPE_CONFIG[type];
          const count = type === "poetry" ? stats?.poems : type === "story" ? stats?.stories : stats?.journals;
          return (
            <div key={type} className="card p-4 text-center">
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-2`}>
                <config.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-800">{count ?? 0}</p>
              <p className="text-xs text-slate-500">{config.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-fit">
        {typeTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveType(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
              activeType === tab.key
                ? "bg-gradient-to-r from-violet-500 to-primary-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeType === tab.key ? "bg-white/20" : "bg-slate-100"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
          placeholder="Search your writings..."
        />
      </div>

      {/* Writings List */}
      {filteredWritings.length === 0 ? (
        <div className="card p-12 text-center">
          <PenTool className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            {searchQuery ? "No results found" : "Your writing journey starts here"}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchQuery
              ? "Try a different search term"
              : "Write your first poem, story, or journal entry!"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => { setShowEditor(true); setEditingWriting(null); }}
              className="btn btn-gradient"
            >
              <Plus className="w-5 h-5" />
              Write Something
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredWritings.map((writing: Writing, i: number) => {
              const config = TYPE_CONFIG[writing.type];
              const preview = writing.content.slice(0, 150) + (writing.content.length > 150 ? "..." : "");

              return (
                <motion.div
                  key={writing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5 hover:border-primary-200 transition-colors cursor-pointer group"
                  onClick={() => { setEditingWriting(writing); setShowEditor(true); }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                      <config.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 truncate">
                          {writing.title}
                        </h3>
                        {writing.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />}
                        {writing.isPublished && <Globe className="w-4 h-4 text-success-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                        <span className="capitalize">{config.label}</span>
                        {writing.genre && <span>· {writing.genre}</span>}
                        <span>· {writing.wordCount} words</span>
                        <span>· {new Date(writing.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 italic">
                        {preview}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite({ id: writing._id }); }}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                        title="Toggle favorite"
                        aria-label="Toggle favorite"
                      >
                        <Heart className={`w-4 h-4 ${writing.isFavorite ? "text-pink-500 fill-pink-500" : "text-slate-400"}`} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(writing._id); }}
                        className="p-2 hover:bg-error-50 rounded-lg text-slate-400 hover:text-error-500"
                        title="Delete"
                        aria-label="Delete writing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Word count footer */}
      {filteredWritings.length > 0 && (
        <div className="text-center text-sm text-slate-400 pt-4">
          {filteredWritings.length} piece{filteredWritings.length !== 1 ? "s" : ""} ·{" "}
          {filteredWritings.reduce((sum: number, w: Writing) => sum + w.wordCount, 0).toLocaleString()} words
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <WritingEditor
            writing={editingWriting}
            onSave={handleSave}
            onClose={() => { setShowEditor(false); setEditingWriting(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== WRITING EDITOR =====
interface WritingEditorProps {
  writing: Writing | null;
  onSave: (data: {
    title: string;
    content: string;
    type: WritingType;
    genre?: string;
    tags?: string[];
    isPublished: boolean;
  }) => Promise<void>;
  onClose: () => void;
}

const WritingEditor: React.FC<WritingEditorProps> = ({ writing, onSave, onClose }) => {
  const [title, setTitle] = useState(writing?.title || "");
  const [content, setContent] = useState(writing?.content || "");
  const [type, setType] = useState<WritingType>(writing?.type || "poetry");
  const [genre, setGenre] = useState(writing?.genre || "");
  const [isPublished, setIsPublished] = useState(writing?.isPublished || false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [saving, setSaving] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        type,
        genre: genre || undefined,
        isPublished,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <motion.div
        className="relative bg-slate-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {writing ? "Edit Piece" : "New Piece ✨"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg" aria-label="Close editor">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Type Selector */}
          <div className="flex gap-2">
            {(["poetry", "story", "journal"] as WritingType[]).map((t) => {
              const config = TYPE_CONFIG[t];
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${
                    type === t
                      ? `bg-gradient-to-r ${config.gradient} text-white shadow-sm`
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input text-lg font-bold"
              placeholder={type === "poetry" ? "My Poem" : type === "story" ? "Chapter 1" : "Dear Diary..."}
              autoFocus
            />
          </div>

          <GenreSelect
            value={genre}
            onChange={setGenre}
            label="Genre (optional)"
            placeholder="Choose a genre..."
            genres={GENRES}
          />

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">
                Your writing *
              </label>
              <span className="text-xs text-slate-400">{wordCount} words</span>
            </div>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input min-h-[250px] resize-y font-[var(--font-body)] leading-relaxed"
                placeholder={
                  type === "poetry"
                    ? "Write your poem here...\n\nEach line a whisper,\nEach verse a dream..."
                    : type === "story"
                      ? "Once upon a time...\n\nWrite your story here. The world you create is yours alone..."
                      : "Dear Diary,\n\nToday was..."
                }
              />
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="absolute bottom-3 right-3 p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-100 rounded-lg transition-colors"
                title="Emoji & GIF"
              >
                <Smile className="w-4 h-4" />
              </button>
              {showEmoji && (
                <GiphyPicker
                  onSelect={(value) => setContent((prev) => prev + value)}
                  onClose={() => setShowEmoji(false)}
                />
              )}
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              {isPublished ? <Eye className="w-5 h-5 text-success-500" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {isPublished ? "Published (visible to everyone)" : "Private (only you can see)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`w-12 h-7 rounded-full transition-colors ${
                isPublished ? "bg-success-500" : "bg-slate-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-slate-50 shadow transition-transform ${
                isPublished ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
            className="btn btn-gradient flex-1"
          >
            {saving ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              <><PenTool className="w-5 h-5" /> {writing ? "Save Changes" : "Save"}</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MyWritings;
