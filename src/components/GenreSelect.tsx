import React from "react";

export const BOOK_GENRES = [
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

interface GenreSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  genres?: string[];
}

const GenreSelect: React.FC<GenreSelectProps> = ({
  value,
  onChange,
  label = "Genre",
  placeholder,
  required,
  genres = BOOK_GENRES,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        required={required}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreSelect;
