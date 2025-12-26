"use client";

type ArtCardProps = {
  title: string;
  imageUrl: string;
  style?: string;
  onClick?: () => void;
  isNew?: boolean;
};

export default function ArtCard({
  title,
  imageUrl,
  style,
  onClick,
  isNew,
}: ArtCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* Image - Portrait style */}
      <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-800">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* New badge */}
        {isNew && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
            NEW
          </span>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Style tag on image */}
        {style && (
          <span className="absolute bottom-2 left-2 text-[11px] text-white/90 font-medium">
            {style}
          </span>
        )}
      </div>

      {/* Title */}
      <div className="mt-2 px-0.5">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );
}

export function ArtCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse" />
      <div className="mt-2 px-0.5">
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
      </div>
    </div>
  );
}
