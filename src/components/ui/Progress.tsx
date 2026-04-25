import { motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs));
}

interface ProgressProps {
  value: number;
  max?: number;
  color?: "primary" | "accent" | "success" | "gradient" | "violet";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const colorStyles: Record<string, string> = {
  primary: "bg-primary-500",
  accent: "bg-accent-500",
  success: "bg-success-500",
  gradient: "bg-gradient-to-r from-primary-500 via-accent-400 to-violet-500",
  violet: "bg-violet-500",
};

const sizeStyles: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = "primary",
  size = "md",
  showLabel = false,
  animated = true,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animated && !reducedMotion;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-slate-600">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-slate-400">{max.toLocaleString()}</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-slate-100 rounded-full overflow-hidden",
          sizeStyles[size],
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", colorStyles[color])}
          initial={shouldAnimate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={shouldAnimate ? { duration: 0.5, ease: "easeOut" } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "accent" | "success";
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "primary",
  showValue = true,
  label,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const reducedMotion = useReducedMotion();

  const colorClasses: Record<string, string> = {
    primary: "text-primary-500",
    accent: "text-accent-500",
    success: "text-success-500",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={colorClasses[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={reducedMotion ? { strokeDashoffset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-2xl font-bold font-display",
              colorClasses[color],
            )}
          >
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-slate-500 mt-0.5">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Progress;
