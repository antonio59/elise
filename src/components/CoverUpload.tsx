import React, { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface CoverUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const CoverUpload: React.FC<CoverUploadProps> = ({ value, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, or WebP).");
      return;
    }

    // Read as data URL for preview + storage
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Cover Art
      </label>
      <div className="flex items-start gap-3">
        {/* Preview */}
        <div className="w-20 h-28 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
          {value ? (
            <img src={value} alt="Cover preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-slate-300" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {/* URL input */}
          <input
            type="url"
            value={value?.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className="input text-sm"
            placeholder="Paste image URL..."
          />

          {/* Upload button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn btn-secondary text-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Image
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          <p className="text-xs text-slate-400">
            JPG, PNG, or WebP. Or paste a URL from Google Books.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoverUpload;
