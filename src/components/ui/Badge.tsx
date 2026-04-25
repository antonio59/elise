import { motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs));
}

export type BadgeVariant =
  | "primary"
  | "accent"
  | "slate"
  | "success"
  | "warning"
  | "error"
  | "outline"
  | "violet"
  | "default";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  animated?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-100 text-primary-700 border-primary-200",
  accent: "bg-accent-100 text-accent-700 border-accent-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-success-50 text-success-600 border-success-100",
  warning: "bg-accent-100 text-accent-700 border-accent-200",
  error: "bg-error-50 text-error-600 border-error-100",
  outline: "bg-transparent text-slate-600 border-slate-300",
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  default: "bg-slate-100 text-slate-600 border-slate-200",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  removable = false,
  onRemove,
  className,
  animated = false,
}) => {
  const Component = animated ? motion.span : "span";
  const animationProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...animationProps}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-slate-900/10 p-0.5 transition-colors"
          aria-label="Remove badge"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </Component>
  );
};

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description?: string;
  unlocked?: boolean;
  rarity?: "common" | "rare" | "epic" | "legendary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const rarityStyles: Record<string, string> = {
  common: "from-slate-200 to-slate-300",
  rare: "from-primary-300 to-primary-400",
  epic: "from-accent-300 to-accent-400",
  legendary: "from-star to-star-light",
};

const rarityShadows: Record<string, string> = {
  common: "",
  rare: "shadow-primary",
  epic: "shadow-accent",
  legendary: "shadow-star",
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  name,
  description,
  unlocked = true,
  rarity = "common",
  size = "md",
  className,
}) => {
  const sizeClasses: Record<string, string> = {
    sm: "w-12 h-12 text-xl",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  };

  return (
    <motion.div
      className={cn("flex flex-col items-center gap-2", className)}
      initial={useReducedMotion() ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={useReducedMotion() ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
    >
      <div
        className={cn(
          sizeClasses[size],
          "rounded-full flex items-center justify-center",
          "bg-gradient-to-br",
          rarityStyles[rarity],
          rarityShadows[rarity],
          !unlocked && "grayscale opacity-50",
          "transition-all duration-300",
        )}
      >
        <span className={!unlocked ? "opacity-50" : ""}>{icon}</span>
      </div>
      <div className="text-center">
        <p
          className={cn(
            "font-medium text-sm",
            !unlocked ? "text-slate-400" : "text-slate-900",
          )}
        >
          {name}
        </p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default Badge;
