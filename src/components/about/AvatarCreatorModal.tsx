import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Shuffle, Check, X } from "lucide-react";

const AVATAR_STYLES = [
  { id: "fun-emoji", label: "Fun Emoji", desc: "Colorful emoji-style faces" },
  { id: "adventurer", label: "Adventurer", desc: "Bold character art" },
  { id: "lorelei", label: "Lorelei", desc: "Elegant illustrated portraits" },
  { id: "micah", label: "Micah", desc: "Clean minimal avatars" },
  { id: "miniavs", label: "Mini Avatars", desc: "Cute mini characters" },
  { id: "notionists", label: "Notionists", desc: "Playful doodle style" },
  { id: "open-peeps", label: "Open Peeps", desc: "Hand-drawn people" },
  { id: "personas", label: "Personas", desc: "Stylish illustrated heads" },
  { id: "pixel-art", label: "Pixel Art", desc: "Retro pixel characters" },
  { id: "thumbs", label: "Thumbs", desc: "Quirky thumb-shaped avatars" },
  { id: "croodles", label: "Croodles", desc: "Scribbly doodle faces" },
  { id: "big-ears", label: "Big Ears", desc: "Adorable big-eared creatures" },
  { id: "bottts", label: "Robots", desc: "Cute robot avatars" },
];

interface AvatarCreatorModalProps {
  show: boolean;
  onClose: () => void;
  updateProfile: (args: Record<string, unknown>) => Promise<unknown>;
  generateUploadUrl: () => Promise<string>;
}

const AvatarCreatorModal: React.FC<AvatarCreatorModalProps> = ({
  show,
  onClose,
  updateProfile,
  generateUploadUrl,
}) => {
  const [selectedStyle, setSelectedStyle] = useState("fun-emoji");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!show) return null;

  const randomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setPreviewUrl(`https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${newSeed}&size=200`);
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
    const newSeed = Math.random().toString(36).substring(2, 10);
    setPreviewUrl(`https://api.dicebear.com/9.x/${styleId}/svg?seed=${newSeed}&size=200`);
  };

  const saveAvatar = async () => {
    if (!previewUrl) return;
    setUploading(true);
    try {
      const response = await fetch(previewUrl);
      const svg = await response.text();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const file = new File([blob], "avatar.svg", { type: "image/svg+xml" });
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await result.json();
      await updateProfile({ avatarStorageId: storageId });
      onClose();
      setPreviewUrl(null);
    } catch (err) {
      console.error("Avatar save failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setPreviewUrl(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        className="relative bg-slate-50 rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Create Your Avatar ✨</h2>
              <p className="text-sm text-slate-500">Pick a style, then keep shuffling until you love it</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg" aria-label="Close avatar creator">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-violet-50 border-2 border-slate-200 mb-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👧</div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={randomizeAvatar} className="btn btn-secondary text-sm">
                <Shuffle className="w-4 h-4" /> Shuffle
              </button>
              {previewUrl && (
                <button onClick={saveAvatar} disabled={uploading} className="btn btn-primary text-sm">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Use This
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 mb-3">Choose a style:</p>
            <div className="grid grid-cols-2 gap-2">
              {AVATAR_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary-400 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={`https://api.dicebear.com/9.x/${style.id}/svg?seed=elise&size=40`}
                          alt={style.label}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-800">{style.label}</p>
                        <p className="text-xs text-slate-400">{style.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarCreatorModal;
