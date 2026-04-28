import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Palette, PenTool, Sparkles } from "lucide-react";

const verbs = [
  { text: "reading", icon: BookOpen },
  { text: "drawing", icon: Palette },
  { text: "writing", icon: PenTool },
  { text: "exploring", icon: Sparkles },
];

interface DashboardHeaderProps {
  onStartTour: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onStartTour }) => {
  const [verbIndex, setVerbIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVerbIndex((i) => (i + 1) % verbs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Hey{" "}
          <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
            Elise
          </span>
        </h1>
        <p className="text-slate-500 mt-1 flex items-center gap-1.5">
          What are we
          <AnimatePresence mode="wait">
            <motion.span
              key={verbs[verbIndex].text}
              className="inline-flex items-center gap-1 text-primary-500 font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {React.createElement(verbs[verbIndex].icon, {
                className: "w-4 h-4",
              })}
              {verbs[verbIndex].text}
            </motion.span>
          </AnimatePresence>
          today?
        </p>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onStartTour}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Take the tour again"
        >
          <Sparkles className="w-4 h-4" />
          Tour
        </motion.button>
      </div>
    </div>
  );
};

export default DashboardHeader;
