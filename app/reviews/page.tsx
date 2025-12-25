"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import LikeButton from "@/components/LikeButton";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { PenLine, Sparkles, Filter } from "lucide-react";

const moodColors: Record<string, { bg: string; text: string; label: string }> =
  {
    sakura: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-700 dark:text-pink-300",
      label: "Sakura",
    },
    mint: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-300",
      label: "Mint",
    },
    sky: {
      bg: "bg-sky-100 dark:bg-sky-900/30",
      text: "text-sky-700 dark:text-sky-300",
      label: "Sky",
    },
    kawaii: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      label: "Kawaii",
    },
    gold: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      label: "Gold",
    },
  };

export default function ReviewsGalleryPage() {
  const [minRating, setMinRating] = useState(0);
  const reviews = useQuery(api.reviews.getPublished, { limit: 60 });

  const filtered = useMemo(
    () =>
      (reviews ?? []).filter((r: any) =>
        minRating ? r.rating >= minRating : true,
      ),
    [reviews, minRating],
  );

  const isLoading = reviews === undefined;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-amber-950/20 dark:via-orange-950/10 dark:to-neutral-950 py-16 lg:py-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-20 w-64 h-64 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-900/80 shadow-sm border border-amber-100 dark:border-amber-900/50 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {filtered.length} review{filtered.length !== 1 ? "s" : ""} shared
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black">
            <span className="text-gray-900 dark:text-white">Reading</span>{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Diary
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            My thoughts and feelings about the books I&apos;ve read
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-neutral-800 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Filter size={16} />
              <span className="text-sm font-medium">Filter</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Min rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value={0}>All</option>
                {[3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}★ & up
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 dark:bg-neutral-900 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <PenLine className="w-10 h-10 text-amber-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                No reviews yet!
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Reviews will appear here once published
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((review: any) => {
                const mood = moodColors[review.moodColor] || {
                  bg: "bg-gray-100 dark:bg-neutral-800",
                  text: "text-gray-600 dark:text-gray-400",
                  label: "Mood",
                };

                return (
                  <Link
                    key={review._id}
                    href={`/review/${review._id}`}
                    className="group"
                  >
                    <Card hover className="h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
                            {review.bookTitle}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {review.author}
                          </p>
                        </div>
                        <div className="flex text-amber-400 text-sm shrink-0">
                          {"★".repeat(review.rating)}
                          <span className="text-gray-300 dark:text-neutral-600">
                            {"★".repeat(5 - review.rating)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {review.content}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={review.user?.avatarUrl}
                            fallback={review.user?.username || "A"}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {review.user?.username || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div onClick={(e) => e.preventDefault()}>
                          <LikeButton
                            contentId={review._id}
                            contentType="review"
                          />
                        </div>
                      </div>

                      {/* Mood Tag */}
                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${mood.bg} ${mood.text}`}
                        >
                          {mood.label}
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
