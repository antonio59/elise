import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

interface NotificationSettingsProps {
  notifications: boolean;
  setNotifications: (value: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notifications,
  setNotifications,
}) => {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Notifications</h2>
          <p className="text-sm text-slate-500">Manage your alerts</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="font-medium text-slate-800">Email Notifications</p>
          <p className="text-sm text-slate-500">
            Get notified about new book suggestions
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={notifications}
          onClick={() => setNotifications(!notifications)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setNotifications(!notifications);
            }
          }}
          className={`w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${
            notifications ? "bg-primary-500" : "bg-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-slate-50 rounded-full shadow transition-transform ${
              notifications ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
