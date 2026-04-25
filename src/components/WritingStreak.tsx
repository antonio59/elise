import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PenTool } from "lucide-react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "../hooks/useReducedMotion";

const WritingStreak: React.FC = () => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const streak = useQuery((api as any).writingStreaks.getStreak);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkIn = useMutation((api as any).writingStreaks.checkIn);
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const result = await checkIn({});
      if (!result?.alreadyCheckedIn) {
        setJustCheckedIn(true);
        if (!reducedMotion) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed"],
          });
        }
        setTimeout(() => setJustCheckedIn(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!streak) return null;

  const isOnFire = streak.currentStreak >= 3;
  const icon = streak.currentStreak === 0 ? "✍️" : isOnFire ? "🔥" : "✨";

  const animationProps = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 } };

  return (
    <motion.div
      className={`col-span-2 lg:col-span-4 rounded-2xl p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 border ${
        streak.currentStreak > 0
          ? "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200"
          : "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
      }`}
      {...animationProps}
    >
      <motion.div
        className="text-5xl select-none flex-shrink-0"
        animate={isOnFire && !reducedMotion ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {icon}
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={`text-3xl font-bold font-display ${streak.currentStreak > 0 ? "text-violet-600" : "text-slate-500"}`}>
            {streak.currentStreak}
          </span>
          <span className="text-slate-600 font-medium">
            day{streak.currentStreak !== 1 ? "s" : ""} writing streak
          </span>
          {justCheckedIn && (
            <motion.span
              className="text-sm text-violet-500 font-semibold"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              +1 🎉
            </motion.span>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-0.5">
          Best: <span className="font-medium text-slate-500">{streak.bestStreak}</span> days
          {" · "}
          <span className="font-medium text-slate-500">{streak.totalDays}</span> total check-ins
        </p>
      </div>

      <div className="flex-shrink-0">
        {streak.checkedInToday ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-success-100 text-success-700 rounded-xl font-medium text-sm">
            <span>✓</span> Wrote today!
          </div>
        ) : (
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 active:scale-95 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <PenTool className="w-4 h-4" />
            {loading ? "…" : "I wrote today!"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default WritingStreak;
