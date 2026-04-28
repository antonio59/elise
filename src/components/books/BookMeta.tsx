import React from "react";

interface BookMetaProps {
  title: string;
  author: string;
  genre?: string;
}

const BookMeta: React.FC<BookMetaProps> = ({ title, author, genre }) => {
  return (
    <>
      <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-1">{author}</p>
      {genre && genre !== "Other" && (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
          {genre}
        </span>
      )}
    </>
  );
};

export default BookMeta;
