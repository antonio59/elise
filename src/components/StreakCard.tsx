import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PenTool } from "lucide-react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "../hooks/useReducedMotion";

type StreakType = "reading" | "writing";

interface StreakConfig {
  query: typeof api.readingStreaks.getStreak;
  mutation: typeof api.readingStreaks.checkIn;
  label: string;
  emoji: { zero: string; active: string; fire: string };
  colors: {
    bg: string;
    border: string;
    text: string;
    button: string;
    buttonHover: string;
    confetti: string[];
  };
  checkedInLabel: string;
  checkInLabel: string;
  showIcon?: boolean;
}

const configs: Record<StreakType, StreakConfig> = {
  reading: {
    query: api.readingStreaks.getStreak,
    mutation: api.readingStreaks.checkIn,
    label: "reading",
    emoji: { zero: "📖", active: "✨", fire: "🔥" },
    colors: {
      bg: "from-primary-50 to-primary-100",
      border: "border-primary-200",
      text: "text-primary-600",
      button: "bg-orange-500 hover:bg-orange-600",
      buttonHover: "",
      confetti: ["#f97316", "#fbbf24", "#ef4444", "#fb923c"],
    },
    checkedInLabel: "Read today!",
    checkInLabel: "I read today! 🔥",
  },
  writing: {
    query: api.writingStreaks.getStreak as unknown as typeof api.readingStreaks.getStreak,
    mutation: api.writingStreaks.checkIn as unknown as typeof api.readingStreaks.checkIn,
    label: "writing",
    emoji: { zero: "✍️", active: "✨", fire: "🔥" },
    colors: {
      bg: "from-violet-50 to-violet-100",
      border: "border-violet-200",
      text: "text-violet-600",
      button: "bg-violet-500 hover:bg-violet-600",
      buttonHover: "",
      confetti: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed"],
    },
    checkedInLabel: "Wrote today!",
    checkInLabel: "I wrote today!",
    showIcon: true,
  },
};

interface StreakCardProps {
  type: StreakType;
}

const StreakCard: React.FC<StreakCardProps> = ({ type }) => {
  const config = configs[type];
  const streak = useQuery(config.query);
  const checkIn = useMutation(config.mutation);
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
            colors: config.colors.confetti,
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
  const icon =
    streak.currentStreak === 0
      ? config.emoji.zero
      : isOnFire
        ? config.emoji.fire
        : config.emoji.active;

  const animationProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: type === "reading" ? 0.15 : 0.1 },
      };

  return (
    <motion.div
      className={`col-span-2 lg:col-span-4 rounded-2xl p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 border ${
        streak.currentStreak > 0
          ? `bg-gradient-to-br ${config.colors.bg} ${config.colors.border}`
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
          <span
            className={`text-3xl font-bold font-display ${streak.currentStreak > 0 ? config.colors.text : "text-slate-500"}`}
          >
            {streak.currentStreak}
          </span>
          <span className="text-slate-600 font-medium">
            day{streak.currentStreak !== 1 ? "s" : ""} {config.label} streak
          </span>
          {justCheckedIn && (
            <motion.span
              className={`text-sm ${type === "reading" ? "text-orange-500" : "text-violet-500"} font-semibold`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              +1 🎉
            </motion.span>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-0.5">
          Best:{" "}
          <span className="font-medium text-slate-500">
            {streak.bestStreak}
          </span>{" "}
          days ·{" "}
          <span className="font-medium text-slate-500">
            {streak.totalDays}
          </span>{" "}
          total check-ins
        </p>
      </div>

      <div className="flex-shrink-0">
        {streak.checkedInToday ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-success-100 text-success-700 rounded-xl font-medium text-sm">
            <span>✓</span> {config.checkedInLabel}
          </div>
        ) : (
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className={`px-4 py-2 ${config.colors.button} active:scale-95 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm`}
          >
            {config.showIcon && <PenTool className="w-4 h-4" />}
            {loading ? "…" : config.checkInLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default StreakCard;
