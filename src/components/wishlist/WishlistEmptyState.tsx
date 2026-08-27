import React from "react";
import { motion } from "framer-motion";
import { Gift, MessageSquarePlus } from "lucide-react";

interface WishlistEmptyStateProps {
  onSuggestClick: () => void;
}

const WishlistEmptyState: React.FC<WishlistEmptyStateProps> = ({
  onSuggestClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
        <Gift className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">
        Wishlist is empty
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        I&apos;m always looking for new books to read. Have a suggestion?
      </p>
      <button onClick={onSuggestClick} className="btn btn-primary min-h-11">
        <MessageSquarePlus className="w-5 h-5" />
        Suggest a book
      </button>
    </motion.div>
  );
};

export default WishlistEmptyState;
