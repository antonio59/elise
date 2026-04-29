import React from "react";
import ReactionBar from "../ReactionBar";

interface BookMoodTagsProps {
  moodTags?: string[];
  bookId: string;
  className?: string;
}

const BookMoodTags: React.FC<BookMoodTagsProps> = ({
  moodTags,
  bookId,
  className = "",
}) => (
  <div className={className}>
    {moodTags && moodTags.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-2">
        {moodTags.map((tag: string) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
    <div className="mt-3 pt-3 border-t border-slate-100">
      <ReactionBar targetType="book" targetId={bookId} />
    </div>
  </div>
);

export default BookMoodTags;
