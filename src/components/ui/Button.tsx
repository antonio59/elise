import { forwardRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "success"
  | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-primary",
  secondary:
    "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-primary-300",
  ghost: "bg-transparent text-primary-600 hover:bg-primary-50",
  accent: "bg-accent-600 text-white hover:bg-accent-700 shadow-accent",
  success: "bg-success-500 text-white hover:bg-success-600 shadow-success",
  danger: "bg-error-500 text-white hover:bg-error-600 shadow-error",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs));
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      icon,
      iconPosition = "left",
      loading = false,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const reducedMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg",
          "font-body transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        disabled={isDisabled}
        whileHover={isDisabled || reducedMotion ? {} : { y: -1, scale: 1.01 }}
        whileTap={isDisabled || reducedMotion ? {} : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size={size} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

