import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { MessageSquare, Send, BookOpen } from "lucide-react";
import { getVisitorId } from "../lib/visitorId";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

const Guestbook: React.FC = () => {
  usePageAnnouncement("Guestbook");
  usePageMeta({ title: "Guestbook", description: "Leave a message for Elise" });

  const entries = useQuery((api as any).guestbook.getEntries) ?? [];
  const submitEntry = useMutation((api as any).guestbook.submit);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await submitEntry({
        name: name.trim(),
        message: message.trim(),
        visitorId: getVisitorId(),
      });
      setSubmitted(true);
      setName("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-12">
      <div className="text-center mb-10">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <MessageSquare className="w-8 h-8 text-primary-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Guestbook</h1>
        <p className="text-slate-500">Leave Elise a nice message ✨</p>
      </div>

      {/* Entry Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should I call you?"
              className="input"
              required
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something kind..."
              className="input min-h-[100px] resize-y"
              rows={3}
              required
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{message.length}/500</p>
          </div>
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="btn btn-gradient w-full"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Sending..." : submitted ? "Sent! ✨" : "Leave Message"}
          </button>
        </div>
      </motion.form>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No messages yet. Be the first! 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry: Doc<"guestbookEntries">, i: number) => (
            <motion.div
              key={entry._id}
              className="card p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0 text-lg">
                  {entry.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{entry.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{entry.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guestbook;
