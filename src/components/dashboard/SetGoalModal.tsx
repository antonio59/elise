import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Target } from "lucide-react";

interface SetGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal?: { targetBooks: number; targetPages?: number } | null;
  year: number;
  onSave: (targetBooks: number, targetPages?: number) => Promise<void>;
}

const SetGoalModal: React.FC<SetGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  year,
  onSave,
}) => {
  const [targetBooks, setTargetBooks] = useState(
    currentGoal?.targetBooks?.toString() || "12",
  );
  const [targetPages, setTargetPages] = useState(
    currentGoal?.targetPages?.toString() || "",
  );
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (currentGoal) {
      setTargetBooks(currentGoal.targetBooks.toString());
      setTargetPages(currentGoal.targetPages?.toString() || "");
    }
  }, [currentGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBooks) return;

    setSaving(true);
    try {
      await onSave(
        parseInt(targetBooks),
        targetPages ? parseInt(targetPages) : undefined,
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-slate-900/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative bg-slate-50 rounded-2xl shadow-xl max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {year} Reading Goal
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target Books *
              </label>
              <input
                type="number"
                value={targetBooks}
                onChange={(e) => setTargetBooks(e.target.value)}
                className="input"
                placeholder="e.g., 24"
                min="1"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                How many books do you want to read this year?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target Pages (optional)
              </label>
              <input
                type="number"
                value={targetPages}
                onChange={(e) => setTargetPages(e.target.value)}
                className="input"
                placeholder="e.g., 5000"
                min="1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Optionally set a page count goal too!
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !targetBooks}
              className="btn btn-primary w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Save Goal
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SetGoalModal;
