"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/convex";
import { searchBooks, BookResult } from "@/lib/bookSearch";
import {
  overlayVariants,
  modalVariants,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import { X, Search, Loader2, Book, Gift, Send } from "lucide-react";
import Button from "./ui/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SuggestBookModal({ isOpen, onClose }: Props) {
  const submitSuggestion = useMutation(api.bookSuggestions.submit);

  const [step, setStep] = useState<"search" | "details">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);

  const [yourName, setYourName] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Generate a simple client ID for rate limiting
  const [clientId] = useState(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("suggestion_client_id");
      if (!id) {
        id = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("suggestion_client_id", id);
      }
      return id;
    }
    return `client_${Date.now()}`;
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep("search");
      setQuery("");
      setResults([]);
      setSelectedBook(null);
      setYourName("");
      setReason("");
      setMessage("");
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (query.length < 2) return;
    setSearching(true);
    const books = await searchBooks(query);
    setResults(books);
    setSearching(false);
  };

  const handleSelectBook = (book: BookResult) => {
    setSelectedBook(book);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !yourName.trim()) return;

    setSubmitting(true);
    setMessage("");

    try {
      await submitSuggestion({
        suggestedBy: yourName.trim(),
        title: selectedBook.title,
        author: selectedBook.authors.join(", "),
        coverUrl: selectedBook.coverUrl,
        genre: selectedBook.categories?.[0],
        reason: reason.trim() || undefined,
        clientId,
      });

      setSuccess(true);
      setMessage("Thank you! Your suggestion has been submitted.");
    } catch (error: any) {
      setMessage(error.message || "Failed to submit suggestion");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Gift className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Suggest a Book
                </h2>
              </motion.div>
              <motion.button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                        delay: 0.1,
                      }}
                    >
                      <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Gift className="w-8 h-8 text-emerald-500" />
                      </motion.div>
                    </motion.div>
                    <motion.h3
                      className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Suggestion Sent!
                    </motion.h3>
                    <motion.p
                      className="text-gray-500 dark:text-gray-400 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {message}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button onClick={onClose}>Close</Button>
                    </motion.div>
                  </motion.div>
                ) : step === "search" ? (
                  <motion.div
                    key="search"
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Search for a book you think Elise would enjoy!
                    </p>

                    {/* Search Input */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          placeholder="Search by title, author, or ISBN..."
                          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <Search
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                      </div>
                      <Button
                        onClick={handleSearch}
                        disabled={query.length < 2}
                      >
                        {searching ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          "Search"
                        )}
                      </Button>
                    </div>

                    {/* Results */}
                    <AnimatePresence>
                      {results.length > 0 && (
                        <motion.div
                          className="max-h-64 overflow-y-auto space-y-2"
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                        >
                          {results.map((book, index) => (
                            <motion.button
                              key={book.id}
                              onClick={() => handleSelectBook(book)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left border border-gray-100 dark:border-neutral-800"
                              variants={staggerItem}
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              {book.coverUrl ? (
                                <img
                                  src={book.coverUrl}
                                  alt=""
                                  className="w-12 h-16 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-16 bg-gray-100 dark:bg-neutral-800 rounded flex items-center justify-center">
                                  <Book size={20} className="text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                  {book.title}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {book.authors.join(", ")}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {query.length >= 2 &&
                      results.length === 0 &&
                      !searching && (
                        <motion.p
                          className="text-center text-gray-500 dark:text-gray-400 py-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          No books found. Try a different search.
                        </motion.p>
                      )}
                  </motion.div>
                ) : (
                  <motion.form
                    key="details"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Selected Book */}
                    {selectedBook && (
                      <motion.div
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {selectedBook.coverUrl ? (
                          <img
                            src={selectedBook.coverUrl}
                            alt=""
                            className="w-12 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 dark:bg-neutral-700 rounded flex items-center justify-center">
                            <Book size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {selectedBook.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {selectedBook.authors.join(", ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep("search")}
                          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Change
                        </button>
                      </motion.div>
                    )}

                    {/* Your Name */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        placeholder="Who's suggesting this book?"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </motion.div>

                    {/* Reason */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Why do you think she&apos;d like it? (optional)
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="It has great characters, fun adventure..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </motion.div>

                    <AnimatePresence>
                      {message && !success && (
                        <motion.p
                          className="text-sm text-red-500 text-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {message}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.div
                      className="flex gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setStep("search")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting || !yourName.trim()}
                        className="flex-1"
                        isLoading={submitting}
                      >
                        <Send size={16} />
                        Send Suggestion
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
