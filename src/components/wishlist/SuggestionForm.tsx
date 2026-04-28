import React from "react";
import { Loader2, Send, AlertCircle } from "lucide-react";

const GENRES = [
  "Manga",
  "Manhwa",
  "Webtoon",
  "Light Novel",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Horror",
  "Slice of Life",
  "Action",
  "Comedy",
  "Drama",
  "Other",
];

interface SuggestionFormProps {
  title: string;
  setTitle: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  genre: string;
  setGenre: (value: string) => void;
  suggestedBy: string;
  setSuggestedBy: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  email?: string;
  setEmail?: (value: string) => void;
  showBookFields?: boolean;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonClassName?: string;
  children?: React.ReactNode;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({
  title,
  setTitle,
  author,
  setAuthor,
  genre,
  setGenre,
  suggestedBy,
  setSuggestedBy,
  reason,
  setReason,
  email,
  setEmail,
  showBookFields = true,
  submitting,
  error,
  onSubmit,
  submitButtonClassName = "btn btn-gradient w-full",
  children,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {children}

      {showBookFields && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="The name of the book"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input"
              placeholder="Who wrote it?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="input"
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Your Name *
        </label>
        <input
          type="text"
          value={suggestedBy}
          onChange={(e) => setSuggestedBy(e.target.value)}
          className="input"
          placeholder="What should I call you?"
          required
        />
      </div>

      {setEmail && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="If you want me to let you know if I read it!"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Why should I read it? (optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input"
          rows={3}
          placeholder="Tell me why you think I'd like this book!"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          submitting || !title.trim() || !author.trim() || !suggestedBy.trim()
        }
        className={submitButtonClassName}
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Suggestion
          </>
        )}
      </button>
    </form>
  );
};

export default SuggestionForm;
