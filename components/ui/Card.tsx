"use client";

import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hover = false,
      className,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default:
        "bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm",
      elevated: "bg-white dark:bg-neutral-900 shadow-lg",
      outlined:
        "bg-transparent border-2 border-gray-200 dark:border-neutral-700",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-6",
    };

    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl overflow-hidden transition-all duration-300",
          variants[variant],
          paddings[padding],
          hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
