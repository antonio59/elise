import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const BookGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i}>
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4 mt-2" />
        <Skeleton className="h-3 w-1/2 mt-1" />
      </div>
    ))}
  </div>
);

export const ReviewCardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="card p-6 h-[180px]">
        <div className="flex gap-4">
          <Skeleton className="w-20 h-28 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-full mt-3" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const WritingCardSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="card p-6">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6 mt-1" />
        <Skeleton className="h-3 w-4/6 mt-1" />
      </div>
    ))}
  </div>
);

export const ArtGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="aspect-square rounded-xl" />
    ))}
  </div>
);
