import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs));
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "fun" | "minimal";
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}) => {
  const variantStyles = {
    default: "bg-gradient-to-br from-slate-50 to-slate-100",
    fun: "bg-gradient-to-br from-primary-50 via-accent-50 to-violet-50",
    minimal: "bg-transparent",
  };

  return (
    <motion.div
      className={cn(
        "text-center py-12 px-6 rounded-3xl",
        variantStyles[variant],
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-6xl mb-4 inline-block"
        animate={variant === "fun" ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>

      <h3 className="text-xl font-display font-bold text-slate-800 mb-2">
        {title}
      </h3>

      <p className="text-slate-500 max-w-md mx-auto mb-6">{description}</p>

      {action && (
        <motion.button
          onClick={action.onClick}
          className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
