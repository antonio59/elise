import React from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

const FooterCTA: React.FC<{
  onSuggestClick: () => void;
}> = ({ onSuggestClick }) => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-violet-500 to-accent-500" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating sparkles */}
      {["✨", "📖", "💬", "⭐"].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl select-none pointer-events-none hidden sm:block opacity-40"
          style={{
            left: `${15 + i * 22}%`,
            top: i % 2 === 0 ? "15%" : "75%",
          }}
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{
            duration: 3 + i * 0.4,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Got a book idea for me?
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Suggest a book! 📚
          </h2>
          <p className="text-lg text-white/80 max-w-md mx-auto mb-8">
            Read something amazing lately? Drop your recommendation and I might just read it next!
          </p>

          <Button
            variant="secondary"
            size="lg"
            icon={<MessageSquarePlus className="w-5 h-5" />}
            onClick={onSuggestClick}
          >
            Leave a Suggestion
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterCTA;
