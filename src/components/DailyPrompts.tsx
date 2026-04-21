import React, { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Palette, Shuffle, Lightbulb } from "lucide-react";
import { getDailyPrompt, getRandomPrompt, type Prompt } from "../lib/prompts";
import { useReducedMotion } from "../hooks/useReducedMotion";

const DailyPrompts: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const daily = getDailyPrompt();
  const [writingPrompt, setWritingPrompt] = useState<Prompt>(daily.writing);
  const [artPrompt, setArtPrompt] = useState<Prompt>(daily.art);

  const shuffleWriting = () => setWritingPrompt(getRandomPrompt(writingPrompt.category as "poetry" | "story" | "journal"));
  const shuffleArt = () => setArtPrompt(getRandomPrompt("art"));

  const animationProps = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.15 } };

  return (
    <motion.div className="card p-6" {...animationProps}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Daily Prompts</h3>
          <p className="text-sm text-slate-500">Need inspiration? Start here</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Writing Prompt */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Writing</span>
            </div>
            <button
              onClick={shuffleWriting}
              className="p-1.5 text-violet-400 hover:text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
              aria-label="Shuffle writing prompt"
              title="New prompt"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed italic">
            &ldquo;{writingPrompt.text}&rdquo;
          </p>
        </div>

        {/* Art Prompt */}
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Art</span>
            </div>
            <button
              onClick={shuffleArt}
              className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
              aria-label="Shuffle art prompt"
              title="New prompt"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed italic">
            &ldquo;{artPrompt.text}&rdquo;
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyPrompts;
