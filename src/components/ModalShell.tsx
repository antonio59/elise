import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalShellProps {
  isOpen: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  titleId?: string;
}

const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  title,
  closeLabel,
  onClose,
  children,
  maxWidth = "max-w-2xl",
  titleId,
}) => {
  if (!isOpen) return null;

  const headingId = titleId || undefined;

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
          className={`relative bg-slate-50 rounded-2xl shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-auto`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2
                id={headingId}
                className="text-xl font-bold text-slate-800"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg"
                aria-label={closeLabel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModalShell;
