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
    <section className="py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>

        {/* Word-stagger subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-slate-500/80 max-w-lg mx-auto mb-8 font-medium italic flex flex-wrap justify-center gap-x-1.5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.07, delayChildren: 0.4 },
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <a href="#books" className="btn btn-secondary">
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
            Suggest
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
