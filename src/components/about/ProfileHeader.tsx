import React, { useRef, useState } from "react";
import { Camera, Loader2, Sparkles, User } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl?: string;
  name: string;
  setName: (name: string) => void;
  updateProfile: (args: Record<string, unknown>) => Promise<unknown>;
  generateUploadUrl: () => Promise<string>;
  onOpenAvatarCreator: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  name,
  setName,
  updateProfile,
  generateUploadUrl,
  onOpenAvatarCreator,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await res.json();
      await updateProfile({ avatarStorageId: storageId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary-500" />
        Profile
      </h2>
      <div className="flex items-start gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-accent-200 text-2xl">
                👧
              </div>
            )}
          </div>
          <button
            onClick={onOpenAvatarCreator}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-50 rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 border border-slate-200"
            title="Create avatar"
            aria-label="Create avatar"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-2 right-6 w-8 h-8 bg-slate-50 rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 border border-slate-200"
            title="Upload photo"
            aria-label="Upload photo"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-slate-500" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-sm font-medium text-slate-600 mb-1 block">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
