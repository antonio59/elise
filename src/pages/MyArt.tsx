import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Plus,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Heart,
  Pencil,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import ArtworkModalShell from "../components/artwork/ArtworkModalShell";
import GalleryFilterTabs from "../components/GalleryFilterTabs";
import ImageUploadField from "../components/ImageUploadField";

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
  usePageAnnouncement("My Art");
  usePageMeta({ title: "My Art", description: "Manage your artwork" });
  const artworks = useQuery(api.artworks.getMyArtworks) ?? [];

  const createArtwork = useMutation(api.artworks.create);
  const updateArtwork = useMutation(api.artworks.update);
  const removeArtwork = useMutation(api.artworks.remove);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
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

      <GalleryFilterTabs
        filter={filter}
        onChange={setFilter}
        counts={{ all: artworks.length, published: publishedCount, drafts: draftCount }}
      />

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
                        ? "bg-success-500 text-white"
                        : "bg-slate-800/80 text-white"
                    }`}
                  >
                    {art.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditingArtwork(art)}
                    className="p-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl"
                    title="Edit artwork"
                    aria-label="Edit artwork"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
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
                        : "bg-success-500 hover:bg-success-600"
                    } text-white`}
                    title={art.isPublished ? "Unpublish" : "Publish"}
                    aria-label="Toggle publish status"
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
                    className="p-3 bg-error-500 hover:bg-error-600 text-white rounded-xl"
                    title="Delete artwork"
                    aria-label="Delete artwork"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Likes */}
                {art.likes && art.likes > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-slate-900/50 rounded-full text-white text-xs">
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

      {/* Edit Artwork Modal */}
      <EditArtworkModal
        artwork={editingArtwork}
        onClose={() => setEditingArtwork(null)}
        onSave={async (updates) => {
          if (!editingArtwork) return;
          await updateArtwork({
            id: editingArtwork._id,
            ...updates,
          });
          setEditingArtwork(null);
        }}
      />
    </div>
  );
};

// Edit Artwork Modal
interface EditArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onSave: (updates: {
    title?: string;
    description?: string;
    style?: string;
    medium?: string;
    tags?: string[];
    isPublished?: boolean;
  }) => Promise<void>;
}

const EditArtworkModal: React.FC<EditArtworkModalProps> = ({
  artwork,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [medium, setMedium] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (artwork) {
      setTitle(artwork.title);
      setDescription(artwork.description || "");
      setStyle(artwork.style || "");
      setMedium(artwork.medium || "");
      setTags(artwork.tags?.join(", ") || "");
      setIsPublished(artwork.isPublished);
    }
  }, [artwork]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        style: style || undefined,
        medium: medium || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublished,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ArtworkModalShell
      isOpen={!!artwork}
      title="Edit Artwork"
      closeLabel="Close edit modal"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Current Image Preview */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Image
          </label>
          {artwork && (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-48 object-contain bg-slate-100 rounded-xl"
            />
          )}
          <p className="text-xs text-slate-500 mt-1">
            Image cannot be changed. Delete and re-upload to use a different
            image.
          </p>
        </div>

        <ArtworkFormBody
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          style={style}
          onStyleChange={setStyle}
          medium={medium}
          onMediumChange={setMedium}
          tags={tags}
          onTagsChange={setTags}
          isPublished={isPublished}
          onIsPublishedChange={setIsPublished}
        />

        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="btn btn-gradient w-full"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Pencil className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </ArtworkModalShell>
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

  const handleImageChange = (dataUrl: string) => {
    setImagePreview(dataUrl);
    setImageUrl(dataUrl);
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

  return (
    <ArtworkModalShell
      isOpen={isOpen}
      title="Upload Artwork"
      closeLabel="Close upload modal"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Artwork Image *
          </label>
          <ImageUploadField
            preview={imagePreview}
            onChange={handleImageChange}
            onClear={() => {
              setImagePreview(null);
              setImageUrl("");
            }}
            maxSizeMB={5}
          />
        </div>

        <ArtworkFormBody
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          style={style}
          onStyleChange={setStyle}
          medium={medium}
          onMediumChange={setMedium}
          tags={tags}
          onTagsChange={setTags}
          isPublished={isPublished}
          onIsPublishedChange={setIsPublished}
        />

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
    </ArtworkModalShell>
  );
};

// Shared form fields between add and edit modals
interface ArtworkFormBodyProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  style: string;
  onStyleChange: (value: string) => void;
  medium: string;
  onMediumChange: (value: string) => void;
  tags: string;
  onTagsChange: (value: string) => void;
  isPublished: boolean;
  onIsPublishedChange: (value: boolean) => void;
}

const ArtworkFormBody: React.FC<ArtworkFormBodyProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  style,
  onStyleChange,
  medium,
  onMediumChange,
  tags,
  onTagsChange,
  isPublished,
  onIsPublishedChange,
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
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
            onChange={(e) => onStyleChange(e.target.value)}
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
            onChange={(e) => onMediumChange(e.target.value)}
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
          onChange={(e) => onTagsChange(e.target.value)}
          className="input"
          placeholder="Comma separated: fantasy, character, etc."
        />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="font-medium text-slate-800">Published</p>
          <p className="text-sm text-slate-500">
            Make this artwork visible in your public gallery
          </p>
        </div>
        <button
          type="button"
          onClick={() => onIsPublishedChange(!isPublished)}
          className={`w-12 h-7 rounded-full transition-colors ${
            isPublished ? "bg-success-500" : "bg-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-slate-50 rounded-full shadow transition-transform ${
              isPublished ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </>
  );
};

export default MyArt;
