import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Check,
  X,
  Trash2,
  BookPlus,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

type Suggestion = Doc<"bookSuggestions">;

const Suggestions: React.FC = () => {
  const suggestions = useQuery(api.bookSuggestions.getAll) ?? [];
  const approveSuggestion = useMutation(api.bookSuggestions.approve);
  const rejectSuggestion = useMutation(api.bookSuggestions.reject);
  const removeSuggestion = useMutation(api.bookSuggestions.remove);
  const addToBooks = useMutation(api.bookSuggestions.addToBooks);

  const pendingCount = suggestions.filter((s) => s.status === "pending").length;
  const approvedCount = suggestions.filter(
    (s) => s.status === "approved",
  ).length;
  const rejectedCount = suggestions.filter(
    (s) => s.status === "rejected",
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Book Suggestions</h1>
        <p className="text-slate-500 mt-1">
          Book recommendations from your visitors
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingCount}
          </div>
          <div className="text-sm text-slate-500">Pending</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {approvedCount}
          </div>
          <div className="text-sm text-slate-500">Approved</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          <div className="text-sm text-slate-500">Rejected</div>
        </div>
      </div>

      {/* Suggestions List */}
      {suggestions.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No suggestions yet
          </h3>
          <p className="text-slate-500">
            When visitors suggest books, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion: Suggestion, index: number) => (
            <motion.div
              key={suggestion._id}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-slate-800">
                      {suggestion.title}
                    </h3>
                    {getStatusBadge(suggestion.status)}
                  </div>
                  <p className="text-slate-600 mb-2">by {suggestion.author}</p>

                  {suggestion.genre && (
                    <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 mb-2">
                      {suggestion.genre}
                    </span>
                  )}

                  {suggestion.reason && (
                    <p className="text-sm text-slate-500 italic mb-3">
                      "{suggestion.reason}"
                    </p>
                  )}

                  <div className="text-sm text-slate-500">
                    Suggested by{" "}
                    <span className="font-medium">
                      {suggestion.suggestedBy}
                    </span>
                    {suggestion.suggestedByEmail && (
                      <span className="text-slate-400">
                        {" "}
                        ({suggestion.suggestedByEmail})
                      </span>
                    )}
                    <span className="text-slate-400">
                      {" "}
                      &middot;{" "}
                      {new Date(suggestion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {suggestion.status === "pending" && (
                    <>
                      <button
                        onClick={() => addToBooks({ id: suggestion._id })}
                        className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
                        title="Add to wishlist"
                      >
                        <BookPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          approveSuggestion({ id: suggestion._id })
                        }
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectSuggestion({ id: suggestion._id })}
                        className="p-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Delete this suggestion?")) {
                        removeSuggestion({ id: suggestion._id });
                      }
                    }}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
