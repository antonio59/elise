"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useRouter } from "next/navigation";
import ArtCard, { ArtCardSkeleton } from "@/components/ArtCard";
import { Palette, Sparkles } from "lucide-react";

export default function GalleryPage() {
  const router = useRouter();
  const artworks = useQuery(api.artworks.getPublished, {}) ?? [];

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-neutral-950 py-16 lg:py-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-900/80 shadow-sm border border-emerald-100 dark:border-emerald-900/50 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {artworks.length} piece{artworks.length !== 1 ? "s" : ""} in the
              gallery
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black">
            <span className="text-gray-900 dark:text-white">My Art</span>{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Here are some sketches, doodles, and finished pieces I&apos;ve been
            working on!
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {artworks === undefined ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ArtCardSkeleton key={i} />
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <Palette className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                No artwork yet!
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Artwork will appear here once added
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <ArtCard
                  key={artwork._id}
                  title={artwork.title || "Untitled"}
                  imageUrl={artwork.imageUrl}
                  style={artwork.style}
                  onClick={() => router.push(`/artwork/${artwork._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
