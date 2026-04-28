import React from "react";
import { motion } from "framer-motion";
import { Gift, Check } from "lucide-react";
import CoverImage from "../CoverImage";

export interface WishlistBook {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverImageUrl?: string | null;
  coverStorageId?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
  giftedBy?: string;
  boughtBy?: string;
  boughtAt?: number;
}

interface WishlistGridProps {
  books: WishlistBook[];
  onBookClick: (book: WishlistBook) => void;
}

const WishlistGrid: React.FC<WishlistGridProps> = ({ books, onBookClick }) => {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {books.map((book) => (
        <motion.div
          key={book._id}
          className="cursor-pointer group"
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.9 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
              },
            },
          }}
          onClick={() => onBookClick(book)}
        >
          <motion.div
            className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all"
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <CoverImage book={book} className="w-full h-full object-cover" />

            {book.boughtBy ? (
              <div className="absolute inset-0 bg-green-900/60 flex flex-col items-center justify-center">
                <div className="bg-success-500 rounded-full p-2 mb-2 shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs font-bold drop-shadow">
                  Bought!
                </span>
                <span className="text-white/80 text-[10px] mt-0.5 drop-shadow">
                  by {book.boughtBy}
                </span>
              </div>
            ) : (
              <>
                <div className="absolute top-2 left-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
                    {book.title}
                  </p>
                  <p className="text-white/70 text-xs mt-1">{book.author}</p>
                </div>
                <div className="absolute top-2 right-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  ✨
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default WishlistGrid;
