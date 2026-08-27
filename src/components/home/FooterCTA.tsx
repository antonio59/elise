import React from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, BookOpen } from "lucide-react";
import { Button } from "../ui/Button";

const FooterCTA: React.FC<{
  onSuggestClick: () => void;
}> = ({ onSuggestClick }) => {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-slate-50 to-accent-50" />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-700 mb-5">
            <BookOpen className="w-5 h-5" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Suggest a book
          </h2>
          <p className="text-base text-slate-600 max-w-md mx-auto mb-8">
            Read something great lately? Drop a recommendation and I might read it next.
          </p>

          <Button
            variant="primary"
            size="lg"
            className="min-h-11"
            icon={<MessageSquarePlus className="w-5 h-5" />}
            onClick={onSuggestClick}
          >
            Leave a suggestion
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterCTA;
