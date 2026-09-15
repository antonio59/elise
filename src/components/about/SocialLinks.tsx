import React from "react";
import { Quote, Heart, Link2 } from "lucide-react";

interface SocialLinksProps {
  favoriteQuote: string;
  setFavoriteQuote: (quote: string) => void;
  funFact: string;
  setFunFact: (fact: string) => void;
  goodreadsUrl: string;
  setGoodreadsUrl: (url: string) => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  favoriteQuote,
  setFavoriteQuote,
  funFact,
  setFunFact,
  goodreadsUrl,
  setGoodreadsUrl,
}) => {
  return (
    <div className="card p-6">
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary-500" />
        Personal Touches
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
            <Quote className="w-4 h-4" />
            Favourite Quote
          </label>
          <textarea value={favoriteQuote} onChange={(e) => setFavoriteQuote(e.target.value)} className="input h-20 resize-none" placeholder="A quote that means something to you..." />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Fun Fact About Me</label>
          <input type="text" value={funFact} onChange={(e) => setFunFact(e.target.value)} className="input" placeholder="e.g. I once read 5 books in one week!" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
            <Link2 className="w-4 h-4" />
            Goodreads Profile
          </label>
          <input type="url" value={goodreadsUrl} onChange={(e) => setGoodreadsUrl(e.target.value)} className="input" placeholder="https://www.goodreads.com/user/show/..." />
          <p className="text-xs text-slate-500 mt-1">
            Shows as a link on your public About page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
