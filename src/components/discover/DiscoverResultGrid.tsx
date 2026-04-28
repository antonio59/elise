import React from "react";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "../SwipeCard";
import type { BookCandidate } from "./discoverHelpers";

interface DiscoverResultGridProps {
  candidates: BookCandidate[];
  onSwipe: (direction: "left" | "right") => void;
}

const DiscoverResultGrid: React.FC<DiscoverResultGridProps> = ({
  candidates,
  onSwipe,
}) => {
  return (
    <AnimatePresence>
      {candidates.slice(0, 3).map((book, index) => (
        <SwipeCard
          key={book.googleBookId}
          book={book}
          onSwipe={onSwipe}
          isTop={index === 0}
        />
      ))}
    </AnimatePresence>
  );
};

export default DiscoverResultGrid;
