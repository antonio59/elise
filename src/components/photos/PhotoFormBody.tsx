import React from "react";
import { MapPin, Tag, X } from "lucide-react";
import PublishToggle from "../PublishToggle";

type PhotoAlbum = { _id: string; title: string };

interface PhotoFormBodyProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSelectPopularTag: (tag: string) => void;
  albumId: string;
  onAlbumIdChange: (value: string) => void;
  albums: PhotoAlbum[];
  isPublished: boolean;
  onIsPublishedChange: (value: boolean) => void;
  popularTags: string[];
}

const PhotoFormBody: React.FC<PhotoFormBodyProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSelectPopularTag,
  albumId,
  onAlbumIdChange,
  albums,
  isPublished,
  onIsPublishedChange,
  popularTags,
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
          placeholder="Photo title"
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
          rows={2}
          placeholder="Tell us about this photo..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="input"
          placeholder="e.g., London Zoo, Hyde Park"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddTag();
              }
            }}
            className="input flex-1"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={onAddTag}
            className="btn btn-secondary text-sm"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:text-primary-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {popularTags
            .filter((t) => !tags.includes(t))
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectPopularTag(tag)}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
              >
                + {tag}
              </button>
            ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Photo Board
        </label>
        <select
          value={albumId}
          onChange={(e) => onAlbumIdChange(e.target.value)}
          className="input"
        >
          <option value="">No board</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      <PublishToggle
        published={isPublished}
        onChange={onIsPublishedChange}
        label="Published"
      />
    </>
  );
};

export default PhotoFormBody;
