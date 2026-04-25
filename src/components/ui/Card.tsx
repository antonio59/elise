import { forwardRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type CardVariant =
  | "default"
  | "elevated"
  | "interactive"
  | "outlined"
  | "gradient";
export type CardPadding = "none" | "sm" | "md" | "lg";

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  hoverEffect?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-slate-50 shadow-soft",
  elevated: "bg-slate-50 shadow-soft-lg",
  interactive: "bg-slate-50 shadow-soft hover:shadow-soft-lg cursor-pointer",
  outlined: "bg-slate-50 border border-slate-200",
  gradient: "bg-gradient-to-br from-primary-50 to-accent-50 shadow-soft",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      children,
      hoverEffect = false,
      className,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden",
          variantStyles[variant],
          paddingStyles[padding],
          className,
        )}
        whileHover={hoverEffect && !reducedMotion ? { y: -4, scale: 1.01 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  action,
}) => {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Tag = "h3",
}) => {
  return (
    <Tag className={cn("font-display font-bold text-slate-900", className)}>
      {children}
    </Tag>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <p className={cn("text-sm text-slate-500 mt-1", className)}>{children}</p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("mt-4 pt-4 border-t border-slate-100", className)}>
      {children}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "accent" | "success" | "slate" | "violet";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = "primary",
  className,
}) => {
  const colorStyles: Record<string, string> = {
    primary: "text-primary-500",
    accent: "text-accent-500",
    success: "text-success-500",
    slate: "text-slate-500",
    violet: "text-violet-500",
  };

  const bgStyles: Record<string, string> = {
    primary: "bg-primary-50",
    accent: "bg-accent-50",
    success: "bg-success-50",
    slate: "bg-slate-50",
    violet: "bg-violet-50",
  };

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p
            className={cn(
              "text-3xl font-bold font-display mt-1",
              colorStyles[color],
            )}
          >
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-xs mt-2",
                trend.isPositive ? "text-success-600" : "text-error-500",
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className={cn("p-3 rounded-xl", bgStyles[color])}>
            <span className={colorStyles[color]}>{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
