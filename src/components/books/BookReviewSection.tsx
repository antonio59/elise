import React, { useState } from "react";
import { Smile } from "lucide-react";
import GiphyPicker from "../GiphyPicker";
import ReadingJournalHelper from "../ReadingJournalHelper";

const MOOD_TAGS = [
  "dark academia",
  "cottagecore",
  "main character energy",
  "slow burn",
  "found family",
  "enemies to lovers",
  "plot twist",
  "cozy vibes",
  "spicy",
  "soft",
  "wholesome",
  "gripping",
  "emotional damage",
  "healing",
  "magical",
  "realistic",
];

interface BookReviewSectionProps {
  status: "read" | "reading" | "wishlist";
  review: string;
  onReviewChange: (value: string) => void;
  onGiphySelect: (value: string) => void;
  onJournalSelect: (text: string) => void;
  moodTags: string[];
  onMoodTagsChange: (tags: string[]) => void;
  isFavorite: boolean;
  onFavoriteChange: (value: boolean) => void;
}

const BookReviewSection: React.FC<BookReviewSectionProps> = ({
  status,
  review,
  onReviewChange,
  onGiphySelect,
  onJournalSelect,
  moodTags,
  onMoodTagsChange,
  isFavorite,
  onFavoriteChange,
}) => {
  const [showEmojiGiphy, setShowEmojiGiphy] = useState(false);

  return (
    <>
      {status === "read" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mood Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  onMoodTagsChange(
                    moodTags.includes(tag)
                      ? moodTags.filter((t) => t !== tag)
                      : [...moodTags, tag]
                  );
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  moodTags.includes(tag)
                    ? "bg-primary-100 text-primary-700 border border-primary-300"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Click to tag the vibes of this book
          </p>
        </div>
      )}

      {status === "read" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Review
          </label>
          <div className="relative">
            <textarea
              value={review}
              onChange={(e) => onReviewChange(e.target.value)}
              className="w-full h-28 p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="What did you think about this book? Did it make you feel something?"
            />
            <button
              type="button"
              onClick={() => setShowEmojiGiphy(!showEmojiGiphy)}
              className="absolute bottom-2 right-2 p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-100 rounded-lg transition-colors"
              title="Emoji & GIF"
            >
              <Smile className="w-4 h-4" />
            </button>
            {showEmojiGiphy && (
              <GiphyPicker
                onSelect={onGiphySelect}
                onClose={() => setShowEmojiGiphy(false)}
              />
            )}
          </div>
          <ReadingJournalHelper onSelect={onJournalSelect} />
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="font-medium text-slate-800">Favorite</p>
          <p className="text-sm text-slate-500">
            Mark this as one of your favorites
          </p>
        </div>
        <button
          type="button"
          onClick={() => onFavoriteChange(!isFavorite)}
          className={`w-12 h-7 rounded-full transition-colors ${
            isFavorite ? "bg-primary-500" : "bg-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-slate-50 rounded-full shadow transition-transform ${
              isFavorite ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </>
  );
};

export default BookReviewSection;
