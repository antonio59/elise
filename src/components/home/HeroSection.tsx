import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "../ui/Button";
import CoverImage from "../CoverImage";

type HeroBook = {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
};

const HeroSection: React.FC<{
  heroTitle?: string;
  heroSubtitle?: string;
  nowReading?: HeroBook[];
  onSuggestClick: () => void;
}> = ({ heroTitle, heroSubtitle, nowReading = [], onSuggestClick }) => {
  const title = heroTitle ?? "Elise Reads";
  const subtitle =
    heroSubtitle ?? "books I've read, art I make, and words I write";
  const covers = nowReading.slice(0, 3);

  return (
    <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-violet-50 to-accent-50" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div
          className={`flex flex-col ${covers.length > 0 ? "lg:flex-row lg:items-center lg:gap-12" : ""} gap-10`}
        >
          <div className={`text-center ${covers.length > 0 ? "lg:text-left lg:flex-1" : ""}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold mb-5 tracking-wide">
                my little corner of the internet
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-slate-900"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <span className="text-primary-600">{title}</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 mb-8 font-medium italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <a href="#books" className="btn btn-primary min-h-11 px-6">
                <BookOpen className="w-4 h-4" />
                Browse books
              </a>
              <Button
                variant="secondary"
                className="min-h-11"
                icon={<MessageSquarePlus className="w-4 h-4" />}
                onClick={onSuggestClick}
              >
                Suggest a book
              </Button>
            </motion.div>
          </div>

          {covers.length > 0 && (
            <motion.div
              className="flex justify-center lg:justify-end gap-3 sm:gap-4 lg:flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              role="region"
              aria-label="Currently reading"
            >
              {covers.map((book, i) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="block w-28 sm:w-36 md:w-40 flex-shrink-0 group"
                  style={{ zIndex: covers.length - i }}
                >
                  <div
                    className="transition-transform group-hover:-translate-y-1"
                    style={{ transform: `rotate(${(i - 1) * 4}deg)` }}
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white shadow-lg ring-1 ring-slate-200/80">
                      <CoverImage
                        book={book}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 line-clamp-1 text-center">
                      {book.title}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
