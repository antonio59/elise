import React, { useState } from "react";
import { Loader2, Pencil, Upload } from "lucide-react";
import { useTagInput } from "../../hooks/useTagInput";
import PhotoFormBody from "./PhotoFormBody";

interface PhotoFormData {
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
  albumId?: string;
  isPublished: boolean;
}

interface PhotoAlbum {
  _id: string;
  title: string;
}

interface PhotoEditorFormProps {
  initialValues?: Partial<PhotoFormData>;
  albums: PhotoAlbum[];
  onSubmit: (data: PhotoFormData) => Promise<void>;
  actionLabel: string;
  actionIcon?: "edit" | "upload";
  submitDisabled?: boolean;
  onValidate?: () => boolean;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

const POPULAR_TAGS = [
  "nature",
  "portrait",
  "landscape",
  "street",
  "architecture",
  "black & white",
  "macro",
  "travel",
];

const PhotoEditorForm: React.FC<PhotoEditorFormProps> = ({
  initialValues,
  albums,
  onSubmit,
  actionLabel,
  actionIcon = "edit",
  submitDisabled = false,
  onValidate,
  onSuccess,
  children,
}) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [location, setLocation] = useState(initialValues?.location || "");
  const [albumId, setAlbumId] = useState(initialValues?.albumId || "");
  const [isPublished, setIsPublished] = useState(initialValues?.isPublished ?? true);
  const [saving, setSaving] = useState(false);
  const { tags, setTags, tagInput, setTagInput, addTag, removeTag } = useTagInput(
    initialValues?.tags || [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (onValidate && !onValidate()) return;

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        albumId: albumId || undefined,
        isPublished,
      });
      onSuccess?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {children}
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
        onSelectPopularTag={(tag) => setTags((prev) => [...prev, tag])}
        albumId={albumId}
        onAlbumIdChange={setAlbumId}
        albums={albums}
        isPublished={isPublished}
        onIsPublishedChange={setIsPublished}
        popularTags={POPULAR_TAGS}
      />
      <button
        type="submit"
        disabled={saving || !title.trim() || submitDisabled}
        className="btn btn-gradient w-full"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : actionIcon === "upload" ? (
          <Upload className="w-5 h-5" />
        ) : (
          <Pencil className="w-5 h-5" />
        )}
        {saving ? "Saving..." : actionLabel}
      </button>
    </form>
  );
};

export default PhotoEditorForm;
