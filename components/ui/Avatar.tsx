"use client";

import { clsx } from "clsx";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const initials = fallback?.slice(0, 2).toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx(
          "rounded-full object-cover bg-gray-100 dark:bg-neutral-800",
          sizes[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-semibold",
        "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
        sizes[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
