import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useMutation } from "convex/react";
import ModalShell from "../ModalShell";
import { api } from "../../../convex/_generated/api";
import { getVisitorId } from "../../lib/visitorId";
import SuggestionForm from "../wishlist/SuggestionForm";
import BookSearchResults from "./BookSearchResults";
import type { BookSearchResult } from "./BookSearchResults";

interface SuggestBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuggestBookModal: React.FC<SuggestBookModalProps> = ({
  isOpen,
  onClose,
}) => {
  const submitSuggestion = useMutation(api.bookSuggestions.submit);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null,
  );

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [suggestedBy, setSuggestedBy] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search using Open Library API
  useEffect(() => {
    if (searchQuery.length < 2) return;

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=5&fields=title,author_name,cover_i,subject,number_of_pages_median`,
        );
        const data = await response.json();

        const results: BookSearchResult[] = (data.docs || []).map(
          (doc: {
            title?: string;
            author_name?: string[];
            cover_i?: number;
            subject?: string[];
            number_of_pages_median?: number;
          }) => ({
            title: doc.title || "Unknown Title",
            author: doc.author_name?.[0] || "Unknown Author",
            coverUrl: doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              : undefined,
            genre: doc.subject?.[0] || undefined,
            pageCount: doc.number_of_pages_median || undefined,
          }),
        );

        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch {
        console.error("Search failed");
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectBook = (book: BookSearchResult) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCoverUrl(book.coverUrl || "");
    setGenre(book.genre || "");
    setSearchQuery("");
    setShowResults(false);
  };

  const clearSelection = () => {
    setSelectedBook(null);
    setTitle("");
    setAuthor("");
    setCoverUrl("");
    setGenre("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !suggestedBy.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitSuggestion({
        title: title.trim(),
        author: author.trim(),
        coverUrl: coverUrl.trim() || undefined,
        genre: genre || undefined,
        suggestedBy: suggestedBy.trim(),
        suggestedByEmail: email.trim() || undefined,
        reason: reason.trim() || undefined,
        visitorId: getVisitorId(),
      });
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedBook(null);
      setTitle("");
      setAuthor("");
      setCoverUrl("");
      setGenre("");
      setSuggestedBy("");
      setEmail("");
      setReason("");
      setSubmitted(false);
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      title="Suggest a Book"
      closeLabel="Close modal"
      onClose={handleClose}
      maxWidth="max-w-lg"
    >

          {submitted ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-600" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Thank you!
              </h3>
              <p className="text-slate-600 mb-6">
                Your book suggestion has been submitted. I&apos;ll check it out
                soon!
              </p>
              <button onClick={handleClose} className="btn btn-primary">
                Close
              </button>
            </div>
          ) : (
            <SuggestionForm
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
              genre={genre}
              setGenre={setGenre}
              suggestedBy={suggestedBy}
              setSuggestedBy={setSuggestedBy}
              reason={reason}
              setReason={setReason}
              email={email}
              setEmail={setEmail}
              showBookFields={!selectedBook}
              submitting={submitting}
              error={error}
              onSubmit={handleSubmit}
              submitButtonClassName="btn btn-primary w-full"
            >
              <BookSearchResults
                query={searchQuery}
                setQuery={setSearchQuery}
                results={searchResults}
                showResults={showResults && searchQuery.length >= 2}
                searching={searching}
                onSelect={selectBook}
                selectedBook={selectedBook}
                onClearSelection={clearSelection}
              />
            </SuggestionForm>
          )}
    </ModalShell>
  );
};

export default SuggestBookModal;
