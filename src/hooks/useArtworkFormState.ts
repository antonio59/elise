import { useState } from "react";

export function useArtworkFormState(initial?: {
  title?: string;
  description?: string;
  style?: string;
  medium?: string;
  tags?: string;
  isPublished?: boolean;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [style, setStyle] = useState(initial?.style || "");
  const [medium, setMedium] = useState(initial?.medium || "");
  const [tags, setTags] = useState(initial?.tags || "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [saving, setSaving] = useState(false);

  return {
    title, setTitle,
    description, setDescription,
    style, setStyle,
    medium, setMedium,
    tags, setTags,
    isPublished, setIsPublished,
    saving, setSaving,
  };
}
