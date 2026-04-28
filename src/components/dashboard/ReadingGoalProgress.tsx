import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Button } from "../ui/Button";

interface Goal {
  targetBooks: number;
  targetPages?: number;
}

interface GoalProgress {
  year: number;
  goal?: Goal | null;
  booksRead: number;
  pagesRead: number;
  bookProgress: number;
  pageProgress: number;
}

interface ReadingGoalProgressProps {
  goalProgress: GoalProgress | null | undefined;
  onSetGoal: () => void;
}

const ReadingGoalProgress: React.FC<ReadingGoalProgressProps> = ({
  goalProgress,
  onSetGoal,
}) => {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">
              {goalProgress?.year} Reading Goal
            </h3>
            <p className="text-sm text-slate-500">
              {goalProgress?.goal
                ? `${goalProgress.booksRead} of ${goalProgress.goal.targetBooks} books`
                : "No goal set yet"}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onSetGoal}>
          {goalProgress?.goal ? "Edit Goal" : "Set Goal"}
        </Button>
      </div>

      {goalProgress?.goal ? (
        <div className="space-y-3">
          {/* Book Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Books</span>
              <span className="font-medium text-slate-800">
                {goalProgress.bookProgress}%
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress.bookProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Pages Progress (if set) */}
          {goalProgress.goal.targetPages && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Pages</span>
                <span className="font-medium text-slate-800">
                  {goalProgress.pagesRead.toLocaleString()} /{" "}
                  {goalProgress.goal.targetPages.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress.pageProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 bg-slate-50 rounded-xl">
          <p className="text-slate-500">
            Set a reading goal to track your progress this year!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ReadingGoalProgress;
