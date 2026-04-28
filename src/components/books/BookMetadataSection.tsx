import React from "react";
import GoogleBookSearch from "../GoogleBookSearch";
import CoverUpload from "../CoverUpload";

interface BookMetadataSectionProps {
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  pageCount: string;
  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onCoverUrlChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onPageCountChange: (value: string) => void;
}

const BookMetadataSection: React.FC<BookMetadataSectionProps> = ({
  title,
  author,
  coverUrl,
  genre,
  pageCount,
  onTitleChange,
  onAuthorChange,
  onCoverUrlChange,
  onGenreChange,
  onPageCountChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Cover Art
      </label>
      <GoogleBookSearch
        onSelect={(book) => {
          if (!title.trim()) onTitleChange(book.title);
          if (!author.trim()) onAuthorChange(book.author);
          if (!coverUrl.trim()) onCoverUrlChange(book.coverUrl);
          if (!genre || genre === "Other") onGenreChange(book.genre);
          if (!pageCount && book.pageCount > 0)
            onPageCountChange(book.pageCount.toString());
        }}
      />
      <div className="mt-3">
        <CoverUpload value={coverUrl} onChange={onCoverUrlChange} />
      </div>
    </div>
  );
};

export default BookMetadataSection;
