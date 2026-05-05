import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Palette,
  MessageSquarePlus,
  Feather,
  Camera,
} from "lucide-react";
import { Button } from "../ui/Button";

const FLOATING_EMOJIS = [
  { emoji: "📚", x: "8%", y: "20%", delay: 0, duration: 3.2 },
  { emoji: "⭐", x: "92%", y: "18%", delay: 0.5, duration: 2.8 },
  { emoji: "🎨", x: "5%", y: "72%", delay: 1, duration: 3.5 },
  { emoji: "✍️", x: "88%", y: "68%", delay: 0.3, duration: 3.0 },
  { emoji: "🌸", x: "20%", y: "85%", delay: 0.8, duration: 2.6 },
  { emoji: "💜", x: "78%", y: "88%", delay: 1.2, duration: 3.3 },
];

const HeroSection: React.FC<{
  heroTitle?: string;
  heroSubtitle?: string;
  onSuggestClick: () => void;
}> = ({ heroTitle, heroSubtitle, onSuggestClick }) => {
  const title = heroTitle ?? "Elise Reads";
  const subtitle =
    heroSubtitle ?? "books I've read, art I make, and words I write";
  const subtitleWords = subtitle.split(" ");

  return (
    <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-violet-50 to-accent-50" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-48 h-48 bg-accent-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Floating emojis */}
      {FLOATING_EMOJIS.map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl select-none pointer-events-none hidden sm:block"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}

      {/* Content */}
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-5 tracking-wide">
            ✨ welcome to my little corner of the internet
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="bg-gradient-to-r from-primary-600 via-violet-500 to-accent-500 bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h1>

        {/* Word-stagger subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-slate-600 max-w-lg mx-auto mb-10 font-medium italic flex flex-wrap justify-center gap-x-1.5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.07, delayChildren: 0.5 },
            },
          }}
        >
          {subtitleWords.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <a href="#books" className="btn btn-primary">
            <BookOpen className="w-4 h-4" />
            Books
          </a>
          <Link to="/art" className="btn btn-secondary">
            <Palette className="w-4 h-4" />
            Art
          </Link>
          <Link to="/photos" className="btn btn-secondary">
            <Camera className="w-4 h-4" />
            Photos
          </Link>
          <Link to="/writing" className="btn btn-secondary">
            <Feather className="w-4 h-4" />
            Writing
          </Link>
          <Button
            variant="secondary"
            icon={<MessageSquarePlus className="w-4 h-4" />}
            onClick={onSuggestClick}
          >
            Suggest a Book
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
