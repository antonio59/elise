import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  className?: string;
}

export function Rating({ value, max = 5, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4 transition-all",
            i < value
              ? "fill-yellow-400 text-yellow-400 scale-110"
              : "fill-gray-100 text-gray-200"
          )}
        />
      ))}
    </div>
  );
}
