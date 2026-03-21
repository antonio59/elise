import React from "react";
import { motion } from "framer-motion";
import { BookOpen, User, Target } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";

const About: React.FC = () => {
  const { user } = useAuth();
  const profile = useQuery(api.users.getPublicProfile);

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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">About</h1>
            {user && (
              <a href="/dashboard/about" className="btn btn-secondary text-sm">
                Edit profile →
              </a>
            )}
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
              <p className="text-slate-800 font-medium">{(display as any).currentlyReading.title}</p>
              <p className="text-sm text-slate-500">{(display as any).currentlyReading.author}</p>
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
          {(display as any)?.favoriteBook && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                📖 Favourite Book of All Time
              </h3>
              <p className="text-slate-800 font-medium">{(display as any).favoriteBook}</p>
            </div>
          )}

          {/* Books Read Multiple Times */}
          {(display as any)?.rereads && (display as any).rereads.length > 0 && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                🔄 Books I've Read More Than Once
              </h3>
              <div className="flex flex-wrap gap-2">
                {(display as any).rereads.map((book: string) => (
                  <span key={book} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                    {book}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Favourite Quote */}
          {(display as any)?.favoriteQuote && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                Favourite Quote
              </h3>
              <blockquote className="border-l-4 border-primary-300 pl-4 italic text-slate-700">
                "{(display as any).favoriteQuote}"
              </blockquote>
            </div>
          )}

          {/* Fun Fact */}
          {(display as any)?.funFact && (
            <div className="card p-6 mb-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                Fun Fact
              </h3>
              <p className="text-slate-700">{(display as any).funFact}</p>
            </div>
          )}

          {/* Empty state */}
          {!display?.name && !display?.bio && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">This page is still being set up. Check back soon!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
