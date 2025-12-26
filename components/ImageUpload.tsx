"use client";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { Id } from "@/convex/_generated/dataModel";

type ImageUploadProps = {
  token: string;
  onUploadComplete: (storageId: Id<"_storage">, url: string) => void;
  currentImageUrl?: string | null;
  label?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
};

export default function ImageUpload({
  token,
  onUploadComplete,
  currentImageUrl,
  label = "Upload Image",
  aspectRatio = "square",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null,
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[2/3]",
    landscape: "aspect-video",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl({ token });

      // Upload file to Convex storage
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      // Get the URL for the uploaded file
      const url = preview || "";
      onUploadComplete(storageId as Id<"_storage">, url);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onClick={handleClick}
        className={`relative ${aspectClasses[aspectRatio]} max-w-xs rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-600 hover:border-emerald-400 cursor-pointer transition-colors`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <span className="text-4xl mb-2">📷</span>
            <span className="text-sm font-medium">Click to upload</span>
            <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && !uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Remove image
        </button>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
