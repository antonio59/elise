"use client";
import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api, useAuth } from "@/lib/convex";
import { ART_STYLES } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Check,
  Plus,
  Palette,
  FolderPlus,
  Sparkles,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

type FileWithPreview = { file: File; preview: string; title: string };

export default function ArtUploadImproved() {
  const { token } = useAuth();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [style, setStyle] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [published, setPublished] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [newSeriesName, setNewSeriesName] = useState("");
  const [showNewSeries, setShowNewSeries] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);

  const series: any[] =
    useQuery(api.artworks.getMySeries, token ? { token } : "skip") ?? [];
  const createArtwork = useMutation(api.artworks.create);
  const createSeriesMut = useMutation(api.artworks.createSeries);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    const validFiles: FileWithPreview[] = [];

    for (const f of Array.from(fileList)) {
      if (!allowed.includes(f.type)) {
        setMessage(`${f.name} is not a supported format`);
        continue;
      }
      if (f.size > 10 * 1024 * 1024) {
        setMessage(`${f.name} is too large (max 10MB)`);
        continue;
      }
      validFiles.push({
        file: f,
        preview: URL.createObjectURL(f),
        title: f.name.replace(/\.[^/.]+$/, ""),
      });
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setMessage("");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index: number) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileTitle = (index: number, title: string) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, title } : f)));
  };

  const handleCreateSeries = async () => {
    if (!newSeriesName.trim() || !token) return;
    const id = await createSeriesMut({ token, title: newSeriesName.trim() });
    setSelectedSeries(id);
    setNewSeriesName("");
    setShowNewSeries(false);
  };

  const onUpload = async () => {
    if (files.length === 0 || !token) return;

    setUploading(true);
    setUploadProgress(0);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const uploadUrl = await generateUploadUrl({ token });
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": files[i].file.type },
          body: files[i].file,
        });
        const { storageId } = await result.json();
        const imageUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace(".convex.cloud", ".convex.site")}/getImage?storageId=${storageId}`;

        await createArtwork({
          token,
          title: files[i].title || undefined,
          style: style || undefined,
          imageUrl,
          storageId,
          published,
          seriesId: selectedSeries ? (selectedSeries as any) : undefined,
          seriesOrder: selectedSeries ? i : undefined,
        });

        successCount++;
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (e) {
        console.error(e);
      }
    }

    files.forEach((f) => URL.revokeObjectURL(f.preview));

    if (successCount === files.length) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFiles([]);
        setStyle("");
        setSelectedSeries("");
        setMessage("");
      }, 2000);
    } else {
      setMessage(`Uploaded ${successCount} of ${files.length} images`);
      setFiles([]);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging
            ? "border-lime-500 bg-lime-50 dark:bg-lime-900/20"
            : "border-neutral-300 dark:border-neutral-700 hover:border-lime-400 dark:hover:border-lime-600"
        }`}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          className="hidden"
          id="art-upload-improved"
        />
        <label htmlFor="art-upload-improved" className="cursor-pointer block">
          <motion.div
            animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDragging
                  ? "bg-lime-500 text-white"
                  : "bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400"
              }`}
            >
              <Upload size={28} />
            </div>
            <p className="text-lg font-medium text-neutral-900 dark:text-white mb-1">
              {isDragging
                ? "Drop your artwork here!"
                : "Drag & drop your artwork"}
            </p>
            <p className="text-sm text-neutral-500">
              or{" "}
              <span className="text-lime-600 dark:text-lime-400 underline">
                browse files
              </span>
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              PNG, JPG, WebP, GIF up to 10MB each
            </p>
          </motion.div>
        </label>
      </div>

      {/* File Preview Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-neutral-900 dark:text-white">
                {files.length} {files.length === 1 ? "file" : "files"} selected
              </h4>
              <button
                onClick={() => {
                  files.forEach((f) => URL.revokeObjectURL(f.preview));
                  setFiles([]);
                }}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear all
              </button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {files.map((f, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="relative group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-2 ring-transparent group-hover:ring-lime-500 transition-all">
                    <img
                      src={f.preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                  <input
                    type="text"
                    value={f.title}
                    onChange={(e) => updateFileTitle(i, e.target.value)}
                    placeholder="Title"
                    className="mt-2 w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </motion.div>
              ))}

              {/* Add More Button */}
              <label
                htmlFor="art-upload-improved"
                className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-lime-900/10 transition-all"
              >
                <Plus size={24} className="text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-400">Add more</span>
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style & Series Options */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Style Selection */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                Art Style
              </label>
              <div className="flex flex-wrap gap-2">
                {ART_STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(style === s ? "" : s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      style === s
                        ? "bg-lime-500 text-white"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Series Selection */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                Add to Series (optional)
              </label>
              {!showNewSeries ? (
                <div className="flex gap-2">
                  <select
                    value={selectedSeries}
                    onChange={(e) => {
                      if (e.target.value === "new") {
                        setShowNewSeries(true);
                        setSelectedSeries("");
                      } else {
                        setSelectedSeries(e.target.value);
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="">No series</option>
                    {series.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.title}
                      </option>
                    ))}
                    <option value="new">+ Create new series</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Series name"
                    value={newSeriesName}
                    onChange={(e) => setNewSeriesName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                  <button
                    onClick={handleCreateSeries}
                    className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewSeries(false)}
                    className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Visibility Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-lime-500 focus:ring-lime-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Share publicly in gallery
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button / Progress */}
      <AnimatePresence mode="wait">
        {files.length > 0 && !success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {uploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Uploading...
                  </span>
                  <span className="text-lime-600">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-lime-500 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={onUpload}
                className="w-full py-3 px-4 bg-gradient-to-r from-lime-500 to-green-500 text-white font-medium rounded-xl hover:from-lime-600 hover:to-green-600 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Upload {files.length} Artwork{files.length > 1 ? "s" : ""}
              </button>
            )}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <Check size={32} className="text-white" />
            </motion.div>
            <p className="font-medium text-neutral-900 dark:text-white">
              Upload complete!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {message && !success && (
        <p className="text-sm text-center text-amber-600 dark:text-amber-400">
          {message}
        </p>
      )}
    </div>
  );
}
