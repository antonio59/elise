import React from "react";
import { Heart, BookMarked, BookOpen } from "lucide-react";

interface FavoriteBookCardProps {
  favoriteBook: string;
  setFavoriteBook: (book: string) => void;
  rereads: string;
  setRereads: (rereads: string) => void;
}

const FavoriteBookCard: React.FC<FavoriteBookCardProps> = ({
  favoriteBook,
  setFavoriteBook,
  rereads,
  setRereads,
}) => {
  return (
    <div className="card p-6">
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-error-400" />
        Favourites
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4" />
            Favourite Book of All Time
          </label>
          <input type="text" value={favoriteBook} onChange={(e) => setFavoriteBook(e.target.value)} className="input" placeholder="e.g. The Hunger Games by Suzanne Collins" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Books I've Read More Than Once
          </label>
          <input type="text" value={rereads} onChange={(e) => setRereads(e.target.value)} className="input" placeholder="e.g. Harry Potter, The Hobbit, Matilda" />
          <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteBookCard;
