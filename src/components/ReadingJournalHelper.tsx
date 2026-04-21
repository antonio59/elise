import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb } from "lucide-react";

interface Prompt {
  label: string;
  template: string;
}

const PROMPTS: Prompt[] = [
  { label: "Vibe check", template: "The vibe of this book in one word: ___. It made me feel ___ because ___." },
  { label: "Favorite character", template: "My favorite character was ___ because ___. They reminded me of ___." },
  { label: "Would I re-read?", template: "Would I read this again? ___ (yes/no/maybe). The part I'd revisit is ___." },
  { label: "Who I'd recommend this to", template: "I'd recommend this to someone who ___. It's perfect for when ___." },
  { label: "What I loved", template: "What I loved most: ___. The moment that hooked me was ___." },
  { label: "What I didn't", template: "What didn't work for me: ___. I wish the author had ___." },
  { label: "Similar books", template: "If you liked this, try: ___. It has the same energy as ___." },
  { label: "Favorite quote", template: "My favorite line: \"___.\" It stuck with me because ___." },
];

interface ReadingJournalHelperProps {
  onSelect: (text: string) => void;
}

const ReadingJournalHelper: React.FC<ReadingJournalHelperProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        Need help writing your review?
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 grid grid-cols-2 gap-2">
              {PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => onSelect(prompt.template)}
                  className="text-left p-2.5 bg-primary-50 hover:bg-primary-100 rounded-lg text-xs text-slate-700 transition-colors border border-primary-100"
                >
                  <span className="font-semibold text-primary-700 block mb-0.5">{prompt.label}</span>
                  <span className="text-slate-500 line-clamp-2">{prompt.template}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingJournalHelper;
