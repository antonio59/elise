import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Plus,
  Upload,
  X,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Heart,
  Pencil,
  MapPin,
  FolderPlus,
  Folder,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import ImageUploadField from "../components/ImageUploadField";
import ModalShell from "../components/ModalShell";
import PhotoFormBody from "../components/photos/PhotoFormBody";

type Photo = Doc<"photos">;
type PhotoAlbum = Doc<"photoAlbums">;

const POPULAR_TAGS = [
  "animals", "nature", "portrait", "landscape", "architecture",
  "food", "travel", "sunset", "flowers", "birds", "cats", "dogs",
  "ocean", "mountains", "city", "macro", "black & white", "street",
];

const MyPhotos: React.FC = () => {
  usePageAnnouncement("My Photos");
  usePageMeta({ title: "My Photos", description: "Manage your photography" });

  const photos = useQuery(api.photos.getMyPhotos) ?? [];
  const albums = useQuery(api.photos.getMyAlbums) ?? [];

  const createPhoto = useMutation(api.photos.create);
  const updatePhoto = useMutation(api.photos.update);
  const removePhoto = useMutation(api.photos.remove);
  const createAlbum = useMutation(api.photos.createAlbum);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [selectedAlbum, setSelectedAlbum] = useState<string | "all">("all");

  const filteredPhotos = photos.filter((photo: Photo) => {
    const statusMatch =
      filter === "published"
        ? photo.isPublished
        : filter === "drafts"
          ? !photo.isPublished
          : true;
    const albumMatch =
      selectedAlbum === "all" ? true : photo.albumId === selectedAlbum;
    return statusMatch && albumMatch;
  });

  const publishedCount = photos.filter((p: Photo) => p.isPublished).length;
  const draftCount = photos.filter((p: Photo) => !p.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Photos</h1>
          <p className="text-slate-500 mt-1">Your photography collection</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAlbumModal(true)}
            className="btn btn-secondary"
          >
            <FolderPlus className="w-5 h-5" />
            New Board
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-gradient"
          >
            <Plus className="w-5 h-5" />
            Upload Photo
          </button>
        </div>
      </div>

      {/* Album Filter */}
      {albums.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedAlbum("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedAlbum === "all"
                ? "bg-primary-100 text-primary-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            All Photos
          </button>
          {albums.map((album: PhotoAlbum) => (
            <button
              key={album._id}
              onClick={() => setSelectedAlbum(album._id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedAlbum === album._id
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              {album.title}
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "all"
              ? "bg-accent-100 text-accent-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({photos.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            filter === "published"
              ? "bg-success-100 text-success-700"
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

      {/* Photos Masonry Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="card p-12 text-center">
          <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {filter === "all" ? "No photos yet" : `No ${filter} photos`}
          </h3>
          <p className="text-slate-500 mb-6">
            Upload your first photo to get started!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-gradient"
          >
            <Upload className="w-5 h-5" />
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredPhotos.map((photo: Photo, index: number) => (
            <motion.div
              key={photo._id}
              className="group relative break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                />

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      photo.isPublished
                        ? "bg-success-500 text-white"
                        : "bg-slate-800/80 text-white"
                    }`}
                  >
                    {photo.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="p-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl"
                    title="Edit photo"
                    aria-label="Edit photo"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      updatePhoto({
                        id: photo._id,
                        isPublished: !photo.isPublished,
                      })
                    }
                    className={`p-3 rounded-xl ${
                      photo.isPublished
                        ? "bg-slate-600 hover:bg-slate-700"
                        : "bg-success-500 hover:bg-success-600"
                    } text-white`}
                    title={photo.isPublished ? "Unpublish" : "Publish"}
                    aria-label="Toggle publish status"
                  >
                    {photo.isPublished ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this photo?")) {
                        removePhoto({ id: photo._id });
                      }
                    }}
                    className="p-3 bg-error-500 hover:bg-error-600 text-white rounded-xl"
                    title="Delete photo"
                    aria-label="Delete photo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Likes */}
                {photo.likes && photo.likes > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-slate-900/50 rounded-full text-white text-xs">
                    <Heart className="w-3 h-3 fill-current" />
                    {photo.likes}
                  </div>
                )}
              </div>

              <div className="mt-2 px-1">
                <h3 className="text-sm font-medium text-slate-800 line-clamp-1">
                  {photo.title}
                </h3>
                {photo.location && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {photo.location}
                  </p>
                )}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400">
                        +{photo.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <AddPhotoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        albums={albums}
        onAdd={async (photo) => {
          await createPhoto(photo);
          setShowAddModal(false);
        }}
      />

      {/* Edit Photo Modal */}
      <EditPhotoModal
        photo={editingPhoto}
        albums={albums}
        onClose={() => setEditingPhoto(null)}
        onSave={async (updates) => {
          if (!editingPhoto) return;
          await updatePhoto({
            id: editingPhoto._id,
            ...updates,
            albumId: updates.albumId ?? undefined,
          });
          setEditingPhoto(null);
        }}
      />

      {/* Create Album Modal */}
      <CreateAlbumModal
        isOpen={showAlbumModal}
        onClose={() => setShowAlbumModal(false)}
        onCreate={async (album) => {
          await createAlbum(album);
          setShowAlbumModal(false);
        }}
      />
    </div>
  );
};

// Create Album Modal
interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (album: {
    title: string;
    description?: string;
    coverImageUrl?: string;
  }) => Promise<void>;
}

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-slate-900/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative bg-slate-50 rounded-2xl shadow-xl max-w-lg w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Create Photo Board</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="e.g., Nature Walks"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                rows={2}
                placeholder="What is this board about?"
              />
            </div>
            <button type="submit" disabled={saving || !title.trim()} className="btn btn-gradient w-full">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <FolderPlus className="w-5 h-5" />}
              {saving ? "Creating..." : "Create Board"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Edit Photo Modal
interface EditPhotoModalProps {
  photo: Photo | null;
  albums: PhotoAlbum[];
  onClose: () => void;
  onSave: (updates: {
    title?: string;
    description?: string;
    location?: string;
    tags?: string[];
    albumId?: Id<"photoAlbums">;
    isPublished?: boolean;
  }) => Promise<void>;
}

const EditPhotoModal: React.FC<EditPhotoModalProps> = ({
  photo,
  albums,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [albumId, setAlbumId] = useState<string | "">("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (photo) {
      setTitle(photo.title);
      setDescription(photo.description || "");
      setLocation(photo.location || "");
      setTags(photo.tags || []);
      setAlbumId(photo.albumId || "");
      setIsPublished(photo.isPublished);
    }
  }, [photo]);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        albumId: (albumId as Id<"photoAlbums">) || undefined,
        isPublished,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!photo) return null;

  return (
    <ModalShell
      isOpen={!!photo}
      title="Edit Photo"
      closeLabel="Close edit modal"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-48 object-contain bg-slate-100 rounded-xl"
        />
        <PhotoFormBody
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          location={location}
          onLocationChange={setLocation}
          tags={tags}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onSelectPopularTag={(tag) => setTags([...tags, tag])}
          albumId={albumId}
          onAlbumIdChange={setAlbumId}
          albums={albums}
          isPublished={isPublished}
          onIsPublishedChange={setIsPublished}
          popularTags={POPULAR_TAGS}
        />
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="btn btn-gradient w-full"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Pencil className="w-5 h-5" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </ModalShell>
  );
};

// Add Photo Modal
interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  albums: PhotoAlbum[];
  onAdd: (photo: {
    title: string;
    description?: string;
    imageUrl: string;
    location?: string;
    tags?: string[];
    albumId?: Id<"photoAlbums">;
    isPublished: boolean;
  }) => Promise<void>;
}

const AddPhotoModal: React.FC<AddPhotoModalProps> = ({
  isOpen,
  onClose,
  albums,
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
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
        location: location.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        albumId: (albumId as Id<"photoAlbums">) || undefined,
        isPublished,
      });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setImagePreview(null);
      setLocation("");
      setTags([]);
      setAlbumId("");
      setIsPublished(true);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      title="Upload Photo"
      closeLabel="Close upload modal"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Photo Image *
          </label>
          <ImageUploadField
            preview={imagePreview}
            onChange={(url) => {
              setImagePreview(url);
              setImageUrl(url);
            }}
            onClear={() => {
              setImagePreview(null);
              setImageUrl("");
            }}
          />
        </div>
        <PhotoFormBody
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          location={location}
          onLocationChange={setLocation}
          tags={tags}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onSelectPopularTag={(tag) => setTags([...tags, tag])}
          albumId={albumId}
          onAlbumIdChange={setAlbumId}
          albums={albums}
          isPublished={isPublished}
          onIsPublishedChange={setIsPublished}
          popularTags={POPULAR_TAGS}
        />
        <button
          type="submit"
          disabled={saving || !title.trim() || !imageUrl}
          className="btn btn-gradient w-full"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" /> Upload Photo
            </>
          )}
        </button>
      </form>
    </ModalShell>
  );
};

export default MyPhotos;
