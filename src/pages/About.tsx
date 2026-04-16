import React from "react";
import { motion } from "framer-motion";
import { BookOpen, User, Target } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CurrentlyReading {
  title: string;
  author: string;
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
  const profile = useQuery(api.users.getPublicProfile) as PublicProfile | undefined | null;

  const display = profile;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">About Me</span>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">Hi, I'm Elise</span>
            </h1>
          </div>

          {/* Profile Card */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="self-center sm:self-start">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-50 flex items-center justify-center">
                  {display?.avatarUrl ? (
                    <img src={display.avatarUrl} alt={display.name || "Profile"} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-primary-300" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-slate-800">
                  {display?.name || "Elise"}
                </h2>
                {display?.bio && (
                  <p className="text-slate-600 mt-2 leading-relaxed">{display.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Currently Reading */}
          {display?.currentlyReading && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Currently Reading
              </h3>
              <p className="text-slate-800 font-medium">{display.currentlyReading.title}</p>
              <p className="text-sm text-slate-500">{display.currentlyReading.author}</p>
            </div>
          )}

          {/* Reading Goal */}
          {display?.readingGoal && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                <Target className="w-4 h-4 inline mr-1" />
                Reading Goal
              </h3>
              <p className="text-slate-700">{display.readingGoal}</p>
            </div>
          )}

          {/* Favourite Genres */}
          {display?.favoriteGenres && display.favoriteGenres.length > 0 && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                Favourite Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {display.favoriteGenres.map((genre: string) => (
                  <span key={genre} className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Favourite Book */}
          {display?.favoriteBook && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                <span aria-hidden="true">📖</span> Favourite Book of All Time
              </h3>
              <p className="text-slate-800 font-medium">{display.favoriteBook}</p>
            </div>
          )}

          {/* Books Read Multiple Times */}
          {display?.rereads && display.rereads.length > 0 && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                <span aria-hidden="true">🔄</span> Books I've Read More Than Once
              </h3>
              <div className="flex flex-wrap gap-2">
                {display.rereads.map((book: string) => (
                  <span key={book} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                    {book}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Favourite Quote */}
          {display?.favoriteQuote && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                Favourite Quote
              </h3>
              <blockquote className="border-l-4 border-primary-300 pl-4 italic text-slate-700">
                &ldquo;{display.favoriteQuote}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Fun Fact */}
          {display?.funFact && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                Fun Fact
              </h3>
              <p className="text-slate-700">{display.funFact}</p>
            </div>
          )}

          {/* Empty state */}
          {!display?.name && !display?.bio && (
            <div className="text-center py-16 bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl">
              <div className="text-5xl mb-4" aria-hidden="true">📚✨</div>
              <p className="text-lg font-medium text-slate-700">Profile incoming!</p>
              <p className="text-sm text-slate-500 mt-1">Elise is still setting up her about page</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
