import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  User,
  Target,
  Quote,
  Heart,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { pageMeta } from "../lib/seo";
import CoverImage from "../components/CoverImage";

interface CurrentlyReading {
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
}

interface PublicProfile {
  name?: string;
  username?: string;
  avatarUrl?: string | null;
  bio?: string;
  favoriteGenres?: string[];
  readingGoal?: string;
  yearlyBookGoal?: number;
  currentlyReading?: CurrentlyReading | null;
  favoriteBook?: string;
  rereads?: string[];
  favoriteQuote?: string;
  funFact?: string;
}

const About: React.FC = () => {
  usePageAnnouncement("About");
  usePageMeta(pageMeta.about);
  const profile = useQuery(api.users.getPublicProfile) as
    | PublicProfile
    | undefined
    | null;
  const isLoading = profile === undefined;
  const display = profile;

  const hasContent = Boolean(
    display?.name ||
      display?.bio ||
      display?.currentlyReading ||
      display?.readingGoal ||
      (display?.favoriteGenres && display.favoriteGenres.length > 0) ||
      display?.favoriteBook ||
      (display?.rereads && display.rereads.length > 0) ||
      display?.favoriteQuote ||
      display?.funFact,
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-100/80 via-slate-50 to-accent-50/40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full bg-violet-200/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -left-20 w-72 h-72 rounded-full bg-primary-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Hero */}
          <header className="text-center mb-10 sm:mb-12">
            <p className="text-sm font-semibold tracking-wide text-primary-600 mb-4">
              about me
            </p>
            <div className="mx-auto mb-5 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-primary-200 to-violet-200 flex items-center justify-center">
              {display?.avatarUrl ? (
                <img
                  src={display.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary-600" aria-hidden="true" />
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-slate-900 mb-3">
              Hi, I&apos;m{" "}
              <span className="text-primary-600">
                {display?.name || "Elise"}
              </span>
            </h1>
            {display?.bio ? (
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                {display.bio}
              </p>
            ) : (
              !isLoading && (
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                  books I&apos;ve read, art I make, and words I write
                </p>
              )
            )}
          </header>

          {isLoading ? (
            <div className="space-y-4 animate-pulse" aria-busy="true">
              <div className="h-36 rounded-2xl bg-white/70 border border-slate-200" />
              <div className="h-24 rounded-2xl bg-white/70 border border-slate-200" />
              <div className="h-24 rounded-2xl bg-white/70 border border-slate-200" />
            </div>
          ) : !hasContent ? (
            <div className="text-center py-16 px-6 rounded-3xl bg-white/70 border border-primary-100 shadow-soft">
              <Sparkles
                className="w-10 h-10 text-primary-400 mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-lg font-display text-slate-800 mb-1">
                Still writing this page
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Check back soon - or start with the books.
              </p>
              <Link to="/books" className="btn btn-primary min-h-11 px-6">
                <BookOpen className="w-4 h-4" />
                Browse books
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Currently reading - visual first */}
              {display?.currentlyReading && (
                <section className="rounded-3xl bg-white/80 border border-primary-100 shadow-soft p-5 sm:p-6">
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    Currently reading
                  </h2>
                  <div className="flex gap-4 items-start">
                    <div className="w-20 sm:w-24 flex-shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-md ring-1 ring-slate-200/80">
                      <CoverImage
                        book={display.currentlyReading}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="font-display text-xl text-slate-900 leading-snug">
                        {display.currentlyReading.title}
                      </p>
                      <p className="text-slate-500 mt-1">
                        {display.currentlyReading.author}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Quote - color anchor */}
              {display?.favoriteQuote && (
                <section className="rounded-3xl bg-gradient-to-br from-violet-50 to-primary-50 border border-violet-100 p-6 sm:p-8">
                  <Quote
                    className="w-8 h-8 text-violet-400 mb-3"
                    aria-hidden="true"
                  />
                  <blockquote className="font-display text-xl sm:text-2xl text-slate-800 leading-snug">
                    &ldquo;{display.favoriteQuote}&rdquo;
                  </blockquote>
                </section>
              )}

              {/* Goal + fun fact row */}
              {(display?.readingGoal || display?.funFact) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {display?.readingGoal && (
                    <section className="rounded-3xl bg-accent-50/80 border border-accent-100 p-5">
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent-700 mb-2">
                        <Target className="w-4 h-4" aria-hidden="true" />
                        Reading goal
                      </h2>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {display.readingGoal}
                      </p>
                    </section>
                  )}
                  {display?.funFact && (
                    <section className="rounded-3xl bg-star-light/60 border border-star/30 p-5">
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-700 mb-2">
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                        Fun fact
                      </h2>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {display.funFact}
                      </p>
                    </section>
                  )}
                </div>
              )}

              {/* Genres */}
              {display?.favoriteGenres && display.favoriteGenres.length > 0 && (
                <section className="rounded-3xl bg-white/80 border border-slate-200 p-5 sm:p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-3">
                    Favourite genres
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {display.favoriteGenres.map((genre: string) => (
                      <span
                        key={genre}
                        className="inline-flex items-center min-h-9 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-primary-100 text-primary-800"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Favourites */}
              {(display?.favoriteBook ||
                (display?.rereads && display.rereads.length > 0)) && (
                <section className="rounded-3xl bg-white/80 border border-slate-200 p-5 sm:p-6 space-y-5">
                  {display?.favoriteBook && (
                    <div>
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600 mb-2">
                        <Heart
                          className="w-4 h-4 text-primary-500"
                          aria-hidden="true"
                        />
                        Favourite book of all time
                      </h2>
                      <p className="font-display text-lg text-slate-900">
                        {display.favoriteBook}
                      </p>
                    </div>
                  )}
                  {display?.rereads && display.rereads.length > 0 && (
                    <div>
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600 mb-3">
                        <RefreshCw className="w-4 h-4" aria-hidden="true" />
                        Worth reading again
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {display.rereads.map((book: string) => (
                          <span
                            key={book}
                            className="inline-flex items-center min-h-9 px-3.5 py-1.5 rounded-full text-sm font-medium bg-violet-100 text-violet-800"
                          >
                            {book}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              <div className="pt-4 text-center">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 min-h-11 px-2 text-primary-600 font-semibold hover:text-primary-700"
                >
                  <BookOpen className="w-4 h-4" />
                  See my books →
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
