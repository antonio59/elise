import React from "react";
import { motion } from "framer-motion";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface SaveControlsProps {
  saving: boolean;
  saved: boolean;
  saveError: string;
}

const SaveControls: React.FC<SaveControlsProps> = ({ saving, saved, saveError }) => {
  return (
    <div className="flex items-center gap-4">
      <button type="submit" disabled={saving} className="btn btn-primary">
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
      </button>

      {saved && (
        <motion.div
          className="flex items-center gap-2 text-success-600"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Changes saved!</span>
        </motion.div>
      )}
      {saveError && (
        <motion.div
          className="flex items-center gap-2 text-error-600"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{saveError}</span>
        </motion.div>
      )}
    </div>
  );
};

export default SaveControls;
