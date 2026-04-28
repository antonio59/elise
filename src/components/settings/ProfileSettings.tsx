import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface ProfileSettingsProps {
  bio: string;
  setBio: (bio: string) => void;
  email: string | undefined;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ bio, setBio, email }) => {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Profile</h2>
          <p className="text-sm text-slate-500">Your public information</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input"
            rows={3}
            placeholder="Tell visitors a bit about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email || ""}
            className="input bg-slate-50"
            disabled
          />
          <p className="text-xs text-slate-500 mt-1">
            Email cannot be changed
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
