import React from "react";
import GenreSelect from "../GenreSelect";

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

interface BookFormFieldsProps {
  title: string;
  onTitleChange: (value: string) => void;
  author: string;
  onAuthorChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
  pageCount: string;
  onPageCountChange: (value: string) => void;
  showRequired?: boolean;
}

const BookFormFields: React.FC<BookFormFieldsProps> = ({
  title,
  onTitleChange,
  author,
  onAuthorChange,
  genre,
  onGenreChange,
  pageCount,
  onPageCountChange,
  showRequired = true,
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title {showRequired && "*"}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="input"
          placeholder="Book title"
          required={showRequired}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Author {showRequired && "*"}
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          className="input"
          placeholder="Author name"
          required={showRequired}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GenreSelect
          value={genre}
          onChange={onGenreChange}
          genres={GENRES}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pages
          </label>
          <input
            type="number"
            value={pageCount}
            onChange={(e) => onPageCountChange(e.target.value)}
            className="input"
            placeholder="Optional"
          />
        </div>
      </div>
    </>
  );
};

export default BookFormFields;
