import React from "react";
import { BookOpen } from "lucide-react";

const GENRES = [
  "Manga", "Manhwa", "Webtoon", "Light Novel", "Fantasy", "Sci-Fi",
  "Romance", "Mystery", "Horror", "Slice of Life", "Action", "Comedy", "Drama",
];

interface StatsRowProps {
  goal: string;
  setGoal: (goal: string) => void;
  currentlyReading: string;
  setCurrentlyReading: (book: string) => void;
  genres: string[];
  setGenres: (genres: string[]) => void;
}

const StatsRow: React.FC<StatsRowProps> = ({
  goal,
  setGoal,
  currentlyReading,
  setCurrentlyReading,
  genres,
  setGenres,
}) => {
  const toggleGenre = (genre: string) => {
    setGenres(
      genres.includes(genre)
        ? genres.filter((g) => g !== genre)
        : [...genres, genre]
    );
  };

  return (
    <div className="card p-6">
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary-500" />
        Reading
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Reading Goal</label>
          <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} className="input" placeholder="e.g. Read 30 books in 2026" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Currently Reading</label>
          <input type="text" value={currentlyReading} onChange={(e) => setCurrentlyReading(e.target.value)} className="input" placeholder="e.g. Harry Potter and the Chamber of Secrets" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Favourite Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  genres.includes(genre) ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsRow;
