import React, { useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  preview: string | null;
  onChange: (dataUrl: string) => void;
  onClear: () => void;
  maxSizeMB?: number;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  preview,
  onChange,
  onClear,
  maxSizeMB = 8,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Image must be less than ${maxSizeMB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-contain bg-slate-100 rounded-xl"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-2 bg-error-500 text-white rounded-lg"
            aria-label="Remove image preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-slate-300 hover:border-accent-400 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
        >
          <ImageIcon className="w-10 h-10 text-slate-400" />
          <span className="text-slate-500">Click to upload image</span>
          <span className="text-xs text-slate-400">
            PNG, JPG up to {maxSizeMB}MB
          </span>
        </button>
      )}
    </div>
  );
};

export default ImageUploadField;
