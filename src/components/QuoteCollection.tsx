import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Quote, Plus, X, Trash2, Globe, Lock } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";

const QuoteCollection: React.FC = () => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quotes = useQuery((api as any).quotes.getMyQuotes) ?? [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createQuote = useMutation((api as any).quotes.create);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeQuote = useMutation((api as any).quotes.remove);

  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [page, setPage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await createQuote({
        text: text.trim(),
        bookTitle: bookTitle.trim() || undefined,
        page: page ? parseInt(page, 10) : undefined,
        isPublic,
      });
      setText("");
      setBookTitle("");
      setPage("");
      setIsPublic(true);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
            <Quote className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Quote Collection</h3>
            <p className="text-sm text-slate-500">Words that hit different</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-secondary btn-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Quote"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3 mb-4 overflow-hidden"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="The quote..."
              className="input min-h-[80px] resize-y italic"
              rows={2}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Book title (optional)"
                className="input"
              />
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                placeholder="Page (optional)"
                className="input"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                {isPublic ? <Globe className="w-4 h-4 text-success-500" /> : <Lock className="w-4 h-4 text-slate-400" />}
                {isPublic ? "Public" : "Private"}
              </button>
              <button type="submit" disabled={submitting || !text.trim()} className="btn btn-gradient btn-sm">
                <Quote className="w-4 h-4" />
                Save Quote
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {quotes.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-xl">
          <Quote className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No quotes yet. Save your first favorite line!</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1">
          <AnimatePresence>
            {quotes.slice(0, 6).map((q: Doc<"quotes">) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100 relative group"
              >
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{q.text}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {q.bookTitle && <span className="text-xs text-primary-600 font-medium">— {q.bookTitle}</span>}
                    {q.page && <span className="text-xs text-slate-400">p. {q.page}</span>}
                    {!q.isPublic && <Lock className="w-3 h-3 text-slate-400" />}
                  </div>
                  <button
                    onClick={() => removeQuote({ id: q._id })}
                    className="p-1.5 text-slate-400 hover:text-error-500 hover:bg-error-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                    aria-label="Delete quote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {quotes.length > 6 && (
            <p className="text-xs text-slate-400 text-center">+ {quotes.length - 6} more quotes</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default QuoteCollection;
