import React, { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, BookOpen } from "lucide-react";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import DiscoverSearchBar from "../components/discover/DiscoverSearchBar";
import DiscoverResultGrid from "../components/discover/DiscoverResultGrid";
import DiscoverEmptyState from "../components/discover/DiscoverEmptyState";
import {
  mapCategoryToGenre,
  buildSearchQueries,
  type BookCandidate,
} from "../components/discover/discoverHelpers";

const Discover: React.FC = () => {
  usePageAnnouncement("Discover");
  usePageMeta({ title: "Discover", description: "Discover new books" });
  const profile = useQuery(api.discover.getReadingProfile);
  const swipedIds = useQuery(api.discover.getSwipedIds);
  const existingKeys = useQuery(api.discover.getExistingBookKeys);
  const stats = useQuery(api.discover.getStats);
  const recordSwipe = useMutation(api.discover.recordSwipe);
  const convex = useConvex();

  const [candidates, setCandidates] = useState<BookCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastSwipeAction, setLastSwipeAction] = useState<
    "liked" | "passed" | null
  >(null);
  const queryIndexRef = useRef(0);
  const searchQueriesRef = useRef<string[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isReady =
    profile !== undefined && swipedIds !== undefined && existingKeys !== undefined;

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

      let attempts = 0;
      while (newCandidates.length < 10 && attempts < 4) {
        const queryIdx = queryIndexRef.current % queries.length;
        const searchQuery = queries[queryIdx];
        queryIndexRef.current++;
        attempts++;

        const results = await convex.action(api.discover.fetchRecommendations, {
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

      if (isMountedRef.current) {
        setCandidates((prev) => [...prev, ...newCandidates]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  }, [isReady, loading, swipedIds, existingKeys, candidates, convex]);

  useEffect(() => {
    if (isReady && candidates.length === 0 && initialLoad) {
      fetchMore();
    }
  }, [isReady, candidates.length, initialLoad, fetchMore]);

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

      setCandidates((prev) => prev.slice(1));

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

      setTimeout(() => setLastSwipeAction(null), 1500);
    },
    [candidates, recordSwipe]
  );

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
          You've read {profile.totalRead} book
          {profile.totalRead !== 1 ? "s" : ""} so far.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <DiscoverSearchBar stats={stats ?? undefined} profile={profile ?? undefined} />

      <AnimatePresence>
        {lastSwipeAction && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-sm font-medium ${
              lastSwipeAction === "liked"
                ? "bg-success-500 text-white"
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

      <div className="relative w-full" style={{ height: "520px" }}>
        {loading && candidates.length === 0 ? (
          <DiscoverEmptyState loading={loading} />
        ) : candidates.length === 0 && !loading ? (
          <DiscoverEmptyState
            loading={loading}
            onRefresh={() => {
              queryIndexRef.current++;
              fetchMore();
            }}
          />
        ) : (
          <DiscoverResultGrid candidates={candidates} onSwipe={handleSwipe} />
        )}
      </div>

      {candidates.length > 0 && (
        <p className="text-center text-xs text-slate-400 mt-4">
          Swipe or use the buttons. Right = want it, Left = pass.
        </p>
      )}
    </div>
  );
};

export default Discover;
