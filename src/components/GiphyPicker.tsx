import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, Smile, Image as ImageIcon, X } from "lucide-react";

interface GiphyPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

const EMOJIS = [
  "❤️", "🔥", "✨", "💯", "😭", "🥺", "😍", "🤯",
  "📚", "📖", "✍️", "🎨", "🌸", "🦋", "🌙", "⭐",
  "💫", "🎀", "🧸", "🐱", "🌊", "🍵", "🎵", "💜",
  "👏", "🎉", "🙌", "💀", "😂", "🤩", "🫠", "🥳",
];

const GiphyPicker: React.FC<GiphyPickerProps> = ({ onSelect, onClose }) => {
  const [tab, setTab] = useState<"emoji" | "gif">("emoji");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Only query Giphy via Convex when user searches
  const giphyResults = useQuery(
    api.giphy.search,
    searchTerm ? { query: searchTerm } : "skip",
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchTerm(query);
    }
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("emoji")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
            tab === "emoji"
              ? "text-primary-500 border-b-2 border-primary-400"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Smile className="w-4 h-4" />
          Emoji
        </button>
        <button
          type="button"
          onClick={() => setTab("gif")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
            tab === "gif"
              ? "text-primary-500 border-b-2 border-primary-400"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          GIF
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {tab === "emoji" ? (
        <div className="p-3 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="w-7 h-7 flex items-center justify-center text-lg hover:bg-slate-100 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="p-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-400"
                placeholder="Search GIFs..."
              />
            </div>
            <button
              type="button"
              onClick={() => setSearchTerm(query)}
              disabled={!query.trim()}
              className="px-3 py-2 text-sm bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"
            >
              Go
            </button>
          </div>
          <div className="p-3 grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
            {giphyResults ? (
              giphyResults.length > 0 ? (
                giphyResults.map((gif: { id: string; preview: string; url: string }) => (
                  <button
                    key={gif.id}
                    type="button"
                    onClick={() => {
                      onSelect(gif.url);
                      onClose();
                    }}
                    className="aspect-square rounded-lg overflow-hidden hover:ring-2 ring-primary-400 transition-all"
                  >
                    <img
                      src={gif.preview}
                      alt="GIF"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))
              ) : (
                searchTerm && (
                  <p className="col-span-3 text-center text-sm text-slate-400 py-4">
                    No GIFs found
                  </p>
                )
              )
            ) : searchTerm ? (
              <p className="col-span-3 text-center text-sm text-slate-400 py-4">
                Searching...
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiphyPicker;
