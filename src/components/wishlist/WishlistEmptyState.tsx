import React from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";

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
      <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-6xl">🎁</span>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">
        My Wishlist is Empty!
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        I&apos;m always looking for new books to read! Have a suggestion?
      </p>
      <button onClick={onSuggestClick} className="btn btn-gradient">
        <MessageSquarePlus className="w-5 h-5" />
        Suggest a Book
      </button>
    </motion.div>
  );
};

export default WishlistEmptyState;
