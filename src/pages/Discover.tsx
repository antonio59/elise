/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  Heart,
  X,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Loader2,
} from "lucide-react";
import SwipeCard from "../components/SwipeCard";

// Google Books categories → our genres (same mapping as GoogleBookSearch)
const CATEGORY_MAP: Record<string, string> = {
  fantasy: "Fantasy",
  "science fiction": "Sci-Fi",
  "sci-fi": "Sci-Fi",
  romance: "Romance",
  mystery: "Mystery",
  horror: "Horror",
  action: "Action",
  adventure: "Action",
  comedy: "Comedy",
  humor: "Comedy",
  drama: "Drama",
  "slice of life": "Slice of Life",
  manga: "Manga",
  manhwa: "Manhwa",
  webtoon: "Webtoon",
  "light novel": "Light Novel",
  "graphic novel": "Manga",
  thriller: "Mystery",
  suspense: "Mystery",
  "young adult": "Drama",
  contemporary: "Slice of Life",
  historical: "Drama",
  "dark fantasy": "Fantasy",
  "urban fantasy": "Fantasy",
  "paranormal romance": "Romance",
};

function mapCategoryToGenre(categories: string[]): string {
  for (const cat of categories) {
    const lower = cat.toLowerCase().trim();
    if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
    for (const [key, genre] of Object.entries(CATEGORY_MAP)) {
      if (lower.includes(key)) return genre;
    }
  }
  return "Other";
}

interface BookCandidate {
  googleBookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
}

// Search queries based on genres/moods to find recommendations
function buildSearchQueries(
  topGenres: string[],
  topMoods: string[],
  topAuthors: string[],
  highlyRated: string[]
): string[] {
  const queries: string[] = [];

  // Genre-based searches
  for (const genre of topGenres.slice(0, 3)) {
    queries.push(`subject:${genre.toLowerCase()} fiction`);
  }

  // Mood-based searches
  const moodSearchMap: Record<string, string> = {
    "dark academia": "dark academia fiction",
    cottagecore: "cozy cottage fiction",
    "found family": "found family fiction",
    "slow burn": "slow burn romance",
    sapphic: "sapphic fiction",
    "enemies-to-lovers": "enemies to lovers romance",
    "fantasy romance": "fantasy romance",
    paranormal: "paranormal fiction",
    "time travel": "time travel fiction",
    ghosts: "ghost story fiction",
  };

  for (const mood of topMoods.slice(0, 2)) {
    const search = moodSearchMap[mood] ?? `${mood} fiction`;
    queries.push(search);
  }

  // "Similar to" searches based on highly rated books
  for (const title of highlyRated.slice(0, 2)) {
    queries.push(`"similar to" "${title}"`);
  }

  // Author-based for diversity
  for (const author of topAuthors.slice(0, 1)) {
    queries.push(`inauthor:"${author}"`);
  }

  // General discovery queries
  queries.push("best fiction books 2025");
  queries.push("award winning novels");

  return queries;
}

const Discover: React.FC = () => {
  const profile = useQuery(api.discover.getReadingProfile);
  const swipedIds = useQuery(api.discover.getSwipedIds);
  const existingKeys = useQuery(api.discover.getExistingBookKeys);
  const stats = useQuery(api.discover.getStats);
  const recordSwipe = useMutation(api.discover.recordSwipe);
  const convex = useConvex();

  const [candidates, setCandidates] = useState<BookCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastSwipeAction, setLastSwipeAction] = useState<"liked" | "passed" | null>(null);
  const queryIndexRef = useRef(0);
  const searchQueriesRef = useRef<string[]>([]);

  const isReady = profile !== undefined && swipedIds !== undefined && existingKeys !== undefined;

  // Build search queries once profile is loaded
  useEffect(() => {
    if (profile && searchQueriesRef.current.length === 0) {
      searchQueriesRef.current = buildSearchQueries(
        profile.topGenres,
        profile.topMoods,
        profile.topAuthors,
        profile.highlyRated
      );
    }
  }, [profile]);

  const fetchMore = useCallback(async () => {
    if (!isReady || loading) return;

    setLoading(true);
    try {
      const queries = searchQueriesRef.current;
      if (queries.length === 0) return;

      const swipedSet = new Set(swipedIds);
      const existingSet = new Set(existingKeys);
      const newCandidates: BookCandidate[] = [];

      // Try multiple queries to fill the pool
      let attempts = 0;
      while (newCandidates.length < 10 && attempts < 4) {
        const queryIdx = queryIndexRef.current % queries.length;
        const searchQuery = queries[queryIdx];
        queryIndexRef.current++;
        attempts++;

        const results = await convex.action((api as any).discover.fetchRecommendations, {
          searchQuery,
          startIndex: Math.floor(Math.random() * 20),
        });

        for (const result of results) {
          const bookKey = `${result.title.toLowerCase().trim()}::${result.author.toLowerCase().trim()}`;
          if (
            !swipedSet.has(result.googleBookId) &&
            !existingSet.has(bookKey) &&
            !candidates.some((c) => c.googleBookId === result.googleBookId) &&
            !newCandidates.some((c) => c.googleBookId === result.googleBookId) &&
            result.title !== "Unknown Title"
          ) {
            newCandidates.push({
              googleBookId: result.googleBookId,
              title: result.title,
              author: result.author,
              coverUrl: result.coverUrl,
              genre: mapCategoryToGenre(result.categories),
              pageCount: result.pageCount,
              description: result.description,
            });
          }
        }
      }

      setCandidates((prev) => [...prev, ...newCandidates]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [isReady, loading, swipedIds, existingKeys, candidates, convex]);

  // Initial fetch
  useEffect(() => {
    if (isReady && candidates.length === 0 && initialLoad) {
      fetchMore();
    }
  }, [isReady, candidates.length, initialLoad, fetchMore]);

  // Auto-fetch more when running low
  useEffect(() => {
    if (isReady && candidates.length < 3 && !loading && !initialLoad) {
      fetchMore();
    }
  }, [isReady, candidates.length, loading, initialLoad, fetchMore]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      const book = candidates[0];
      if (!book) return;

      const action = direction === "right" ? "liked" : "passed";
      setLastSwipeAction(action);

      // Remove from stack immediately for smooth UX
      setCandidates((prev) => prev.slice(1));

      // Record in background
      await recordSwipe({
        googleBookId: book.googleBookId,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        genre: book.genre,
        pageCount: book.pageCount,
        description: book.description,
        action,
      });

      // Clear the toast after a moment
      setTimeout(() => setLastSwipeAction(null), 1500);
    },
    [candidates, recordSwipe]
  );

  // Not enough reading history
  if (profile && profile.totalRead < 3) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Read more to unlock Discover
        </h2>
        <p className="text-slate-500">
          Mark at least 3 books as read so we can learn your taste and recommend
          books you'll love.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          You've read {profile.totalRead} book{profile.totalRead !== 1 ? "s" : ""} so far.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Discover</h1>
            <p className="text-sm text-slate-500">
              Swipe to find your next read
            </p>
          </div>
        </div>

        {/* Stats bar */}
        {stats && (stats.liked > 0 || stats.passed > 0) && (
          <div className="flex items-center gap-4 mt-4 px-4 py-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-1.5 text-sm">
              <Heart className="w-4 h-4 text-green-500" />
              <span className="font-medium text-slate-700">{stats.liked}</span>
              <span className="text-slate-400">liked</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <X className="w-4 h-4 text-red-400" />
              <span className="font-medium text-slate-700">{stats.passed}</span>
              <span className="text-slate-400">passed</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <span className="font-medium text-slate-700">
                {stats.addedToWishlist}
              </span>
              <span className="text-slate-400">wishlisted</span>
            </div>
          </div>
        )}

        {/* Reading taste pills */}
        {profile && profile.topGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-slate-400 self-center">Based on:</span>
            {profile.topGenres.slice(0, 4).map((genre: string) => (
              <span
                key={genre}
                className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-medium"
              >
                {genre}
              </span>
            ))}
            {profile.topMoods.slice(0, 2).map((mood: string) => (
              <span
                key={mood}
                className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium"
              >
                {mood}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Swipe toast */}
      <AnimatePresence>
        {lastSwipeAction && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-sm font-medium ${
              lastSwipeAction === "liked"
                ? "bg-green-500 text-white"
                : "bg-slate-500 text-white"
            }`}
          >
            {lastSwipeAction === "liked" ? (
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" /> Added to wishlist!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <X className="w-4 h-4" /> Passed
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card stack */}
      <div className="relative w-full" style={{ height: "520px" }}>
        {loading && candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">
              Finding books for you...
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Analyzing your reading taste
            </p>
          </div>
        ) : candidates.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              We've run out of recommendations for now. Refresh to discover more.
            </p>
            <button
              onClick={() => {
                queryIndexRef.current++;
                fetchMore();
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Find more books
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {candidates.slice(0, 3).map((book, index) => (
              <SwipeCard
                key={book.googleBookId}
                book={book}
                onSwipe={handleSwipe}
                isTop={index === 0}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Keyboard hint */}
      {candidates.length > 0 && (
        <p className="text-center text-xs text-slate-400 mt-4">
          Swipe or use the buttons. Right = want it, Left = pass.
        </p>
      )}
    </div>
  );
};

export default Discover;
