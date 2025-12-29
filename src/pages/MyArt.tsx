import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Plus,
  Upload,
  X,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Heart,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

type Artwork = Doc<"artworks">;

const STYLES = [
  "Digital Art",
  "Manga Style",
  "Anime",
  "Traditional",
  "Watercolor",
  "Sketch",
  "Pixel Art",
  "Chibi",
  "Fan Art",
  "Original",
  "Other",
];

const MyArt: React.FC = () => {
  // Get artworks - the query handles auth internally
  const artworks = useQuery(api.artworks.getMyArtworks) ?? [];

  const createArtwork = useMutation(api.artworks.create);
  const updateArtwork = useMutation(api.artworks.update);
  const removeArtwork = useMutation(api.artworks.remove);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  const filteredArtworks = artworks.filter((art: Artwork) => {
    if (filter === "published") return art.isPublished;
    if (filter === "drafts") return !art.isPublished;
    return true;
  });

  const publishedCount = artworks.filter((a: Artwork) => a.isPublished).length;
  const draftCount = artworks.filter((a: Artwork) => !a.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Art</h1>
          <p className="text-slate-500 mt-1">Your creative gallery</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-gradient"
        >
          <Plus className="w-5 h-5" />
          Upload Art
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "all"
              ? "bg-violet-100 text-violet-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({artworks.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            filter === "published"
              ? "bg-green-100 text-green-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Eye className="w-4 h-4" />
          Published ({publishedCount})
        </button>
        <button
          onClick={() => setFilter("drafts")}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            filter === "drafts"
              ? "bg-slate-200 text-slate-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <EyeOff className="w-4 h-4" />
          Drafts ({draftCount})
        </button>
      </div>

      {/* Artworks Grid */}
      {filteredArtworks.length === 0 ? (
        <div className="card p-12 text-center">
          <Palette className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {filter === "all" ? "No artworks yet" : `No ${filter} artworks`}
          </h3>
          <p className="text-slate-500 mb-6">
            Upload your first artwork to get started!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-gradient"
          >
            <Upload className="w-5 h-5" />
            Upload Art
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredArtworks.map((art: Artwork, index: number) => (
            <motion.div
              key={art._id}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      art.isPublished
                        ? "bg-green-500 text-white"
                        : "bg-slate-800/80 text-white"
                    }`}
                  >
                    {art.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      updateArtwork({
                        id: art._id,
                        isPublished: !art.isPublished,
                      })
                    }
                    className={`p-3 rounded-xl ${
                      art.isPublished
                        ? "bg-slate-600 hover:bg-slate-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                    title={art.isPublished ? "Unpublish" : "Publish"}
                  >
                    {art.isPublished ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this artwork?")) {
                        removeArtwork({ id: art._id });
                      }
                    }}
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Likes */}
                {art.likes && art.likes > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                    <Heart className="w-3 h-3 fill-current" />
                    {art.likes}
                  </div>
                )}
              </div>

              <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                {art.title}
              </h3>
              {art.style && (
                <p className="text-xs text-slate-500">{art.style}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Artwork Modal */}
      <AddArtworkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async (artwork) => {
          await createArtwork(artwork);
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

// Add Artwork Modal
interface AddArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (artwork: {
    title: string;
    description?: string;
    imageUrl: string;
    style?: string;
    medium?: string;
    tags?: string[];
    isPublished: boolean;
  }) => Promise<void>;
}

const AddArtworkModal: React.FC<AddArtworkModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [style, setStyle] = useState("");
  const [medium, setMedium] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
        setImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;

    setSaving(true);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl,
        style: style || undefined,
        medium: medium || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublished,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setImageUrl("");
      setImagePreview(null);
      setStyle("");
      setMedium("");
      setTags("");
      setIsPublished(true);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Upload Artwork
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Artwork Image *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-slate-100 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageUrl("");
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-300 hover:border-violet-400 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <ImageIcon className="w-10 h-10 text-slate-400" />
                  <span className="text-slate-500">Click to upload image</span>
                  <span className="text-xs text-slate-400">
                    PNG, JPG up to 5MB
                  </span>
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Artwork title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                rows={3}
                placeholder="Tell us about this artwork..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="input"
                >
                  <option value="">Select style</option>
                  {STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="input"
                  placeholder="e.g., Procreate, Pencil"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input"
                placeholder="Comma separated: fantasy, character, etc."
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">
                  Publish immediately
                </p>
                <p className="text-sm text-slate-500">
                  Make this artwork visible in your public gallery
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  isPublished ? "bg-green-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isPublished ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={saving || !title.trim() || !imageUrl}
              className="btn btn-gradient w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Artwork
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MyArt;
