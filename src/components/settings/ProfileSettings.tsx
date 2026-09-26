import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface ProfileSettingsProps {
  email: string | undefined;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ email }) => {
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
          <h2 className="font-bold text-slate-800">Account</h2>
          <p className="text-sm text-slate-500">Your sign-in details</p>
        </div>
      </div>

      <div className="space-y-4">
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

        <p className="text-sm text-slate-500">
          Name, bio and avatar live on{" "}
          <a
            href="/dashboard/about"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Edit About Page
          </a>
          {" - "}
          that&apos;s everything visitors see.
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
