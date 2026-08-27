import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Feather,
  BookHeart,
  BookOpenText,
  Share2,
  Check,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import ReactionBar from "../components/ReactionBar";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { pageMeta } from "../lib/seo";
import { useReducedMotion } from "../hooks/useReducedMotion";

const typeConfig = {
  poetry: {
    icon: Feather,
    color: "text-violet-600",
    label: "Poetry",
    bg: "bg-violet-50",
  },
  story: {
    icon: BookHeart,
    color: "text-primary-600",
    label: "Story",
    bg: "bg-primary-50",
  },
  journal: {
    icon: BookOpenText,
    color: "text-accent-700",
    label: "Journal",
    bg: "bg-accent-50",
  },
} as const;

const PublicWritingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const writing = useQuery(
    api.writings.getById,
    id ? { id: id as Id<"writings"> } : "skip",
  );
  const allPublished = useQuery(api.writings.getPublished, { limit: 100 });

  const siblings = useMemo(() => {
    if (!allPublished || !writing) return { prev: null, next: null };
    const idx = allPublished.findIndex((w) => w._id === writing._id);
    return {
      prev: idx > 0 ? allPublished[idx - 1] : null,
      next:
        idx >= 0 && idx < allPublished.length - 1
          ? allPublished[idx + 1]
          : null,
    };
  }, [allPublished, writing]);

  const config =
    writing && writing.type in typeConfig
      ? typeConfig[writing.type as keyof typeof typeConfig]
      : typeConfig.story;
  const Icon = config.icon;

  usePageAnnouncement(writing?.title || "Writing");
  usePageMeta(
    writing
      ? pageMeta.writingDetail(writing.title, config.label.toLowerCase())
      : { title: "Writing", description: pageMeta.writing.description },
  );

  if (writing === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-10 bg-slate-200 rounded w-3/4" />
        <div className="h-40 bg-slate-100 rounded" />
      </div>
    );
  }

  if (writing === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-2xl text-slate-800 mb-2">
          Piece not found
        </p>
        <p className="text-slate-500 mb-6">
          This writing might be private or the link is broken.
        </p>
        <Link to="/writing" className="btn btn-primary min-h-11">
          <ArrowLeft className="w-4 h-4" />
          Back to writing
        </Link>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/writing/${writing._id}`
      : "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: writing.title,
          text: `A ${config.label.toLowerCase()} by Elise`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-50/80 via-slate-50 to-primary-50/30"
        aria-hidden="true"
      />

      <article className="relative max-w-2xl mx-auto px-4 py-10 sm:py-14">
        <Link
          to="/writing"
          className="inline-flex items-center gap-1.5 min-h-11 text-sm font-medium text-slate-500 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All writing
        </Link>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {config.label}
            </span>
            {writing.createdAt && (
              <time className="text-xs text-slate-500">
                {new Date(writing.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 mb-6 leading-tight">
            {writing.title}
          </h1>

          <div className="prose-elise text-lg text-slate-700 leading-relaxed whitespace-pre-wrap mb-8">
            {writing.content}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-slate-200">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary-300"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {copied ? "Copied" : "Share"}
            </button>
            <ReactionBar targetType="writing" targetId={writing._id} />
          </div>

          <p className="text-sm text-slate-500 italic mb-8">
            Written by Elise
          </p>

          {(siblings.prev || siblings.next) && (
            <nav
              className="flex flex-col sm:flex-row gap-3"
              aria-label="More writing"
            >
              {siblings.prev ? (
                <Link
                  to={`/writing/${siblings.prev._id}`}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white/80 p-4 hover:border-primary-300 transition-colors"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Previous
                  </p>
                  <p className="font-display font-bold text-slate-800 line-clamp-1">
                    {siblings.prev.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {siblings.next && (
                <Link
                  to={`/writing/${siblings.next._id}`}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white/80 p-4 hover:border-primary-300 transition-colors text-right sm:text-left"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Next
                  </p>
                  <p className="font-display font-bold text-slate-800 line-clamp-1">
                    {siblings.next.title}
                  </p>
                </Link>
              )}
            </nav>
          )}
        </motion.div>
      </article>
    </div>
  );
};

export default PublicWritingDetail;
