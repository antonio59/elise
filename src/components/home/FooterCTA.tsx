import React from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "../ui/Button";

const FooterCTA: React.FC<{
  onSuggestClick: () => void;
}> = ({ onSuggestClick }) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full shadow-sm mb-6">
            <MessageSquarePlus className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-slate-600">
              Have a book idea?
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Got a recommendation?
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
            Read something good lately? Drop it here.
          </p>

          <Button
            variant="primary"
            size="lg"
            icon={<MessageSquarePlus className="w-5 h-5" />}
            onClick={onSuggestClick}
          >
            Suggest a Book
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterCTA;
