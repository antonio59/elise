import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface AccountSettingsProps {
  yearlyBookGoal: string;
  setYearlyBookGoal: (goal: string) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  yearlyBookGoal,
  setYearlyBookGoal,
}) => {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Reading Goals</h2>
          <p className="text-sm text-slate-500">Set your yearly targets</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Yearly Book Goal
        </label>
        <input
          type="number"
          value={yearlyBookGoal}
          onChange={(e) => setYearlyBookGoal(e.target.value)}
          className="input"
          placeholder="e.g., 24"
          min="1"
        />
        <p className="text-xs text-slate-500 mt-1">
          How many books do you want to read each year?
        </p>
      </div>
    </motion.div>
  );
};

export default AccountSettings;
