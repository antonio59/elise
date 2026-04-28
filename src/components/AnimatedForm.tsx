import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedFormProps {
  show: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  className?: string;
}

const AnimatedForm: React.FC<AnimatedFormProps> = ({
  show,
  onSubmit,
  children,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.form
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          onSubmit={onSubmit}
          className={`space-y-3 mb-4 overflow-hidden ${className}`}
        >
          {children}
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default AnimatedForm;
