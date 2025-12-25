"use client";

import Badge from "./ui/Badge";

type ArtCardProps = {
  title: string;
  imageUrl: string;
  style?: string;
  onClick?: () => void;
};

export default function ArtCard({
  title,
  imageUrl,
  style,
  onClick,
}: ArtCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 shadow-sm border border-gray-100 dark:border-neutral-800 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
          {title}
        </h3>
        {style && (
          <Badge variant="pink" className="mt-1">
            {style}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function ArtCardSkeleton() {
  return (
    <div>
      <div className="aspect-square bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
      <div className="mt-3 px-1 space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}
