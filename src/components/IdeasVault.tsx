import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Lightbulb, Plus, X, Archive, Trash2, Sparkles } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";


const IDEA_COLORS: Record<string, string> = {
  writing: "bg-violet-50 text-violet-600 border-violet-200",
  art: "bg-primary-50 text-primary-600 border-primary-200",
  book: "bg-amber-50 text-amber-600 border-amber-200",
  other: "bg-slate-50 text-slate-600 border-slate-200",
};

const IDEA_ACTIVE_COLORS: Record<string, string> = {
  writing: "bg-violet-500 text-white border-violet-600",
  art: "bg-primary-500 text-white border-primary-600",
  book: "bg-amber-500 text-white border-amber-600",
  other: "bg-slate-500 text-white border-slate-600",
};

const IDEA_LABELS: Record<string, string> = {
  writing: "Writing",
  art: "Art",
  book: "Book",
  other: "Other",
};

const IdeasVault: React.FC = () => {
  const ideas = useQuery((api as any).ideas.getMyIdeas, { includeArchived: false }) ?? [];
  const createIdea = useMutation((api as any).ideas.create);
  const updateIdea = useMutation((api as any).ideas.update);
  const removeIdea = useMutation((api as any).ideas.remove);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"writing" | "art" | "book" | "other">("writing");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createIdea({ title: title.trim(), content: content.trim(), type });
      setTitle("");
      setContent("");
      setType("writing");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: Doc<"ideas">["_id"]) => {
    await updateIdea({ id, isArchived: true });
  };

  return (
    <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Ideas Vault</h3>
            <p className="text-sm text-slate-500">Capture creative sparks before they fade</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-secondary btn-sm"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Idea"}
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
            <div className="flex gap-2">
              {(["writing", "art", "book", "other"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    type === t
                      ? IDEA_ACTIVE_COLORS[t]
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {IDEA_LABELS[t]}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Idea title..."
              className="input"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jot down the details..."
              className="input min-h-[80px] resize-y"
              rows={2}
            />
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="btn btn-gradient btn-sm"
            >
              <Lightbulb className="w-4 h-4" />
              Save Idea
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {ideas.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-xl">
          <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No ideas yet. Capture your first spark!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <AnimatePresence>
            {ideas.map((idea: Doc<"ideas">) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl group"
              >
                <span className={`text-xs px-2 py-0.5 rounded-full border ${IDEA_COLORS[idea.type]}`}>
                  {IDEA_LABELS[idea.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{idea.title}</p>
                  {idea.content && <p className="text-xs text-slate-500 line-clamp-2">{idea.content}</p>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleArchive(idea._id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg"
                    title="Archive"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeIdea({ id: idea._id })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default IdeasVault;
