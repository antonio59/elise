import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Palette,
  PenTool,
  Compass,
  Heart,
  User,
  Camera,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import { useReducedMotion } from "../hooks/useReducedMotion";

const REMINDERS = [
  {
    icon: BookOpen,
    title: "Log it the day you finish",
    body: "Even a quick rating counts - your shelf is the tracker and the brag board.",
  },
  {
    icon: Palette,
    title: "Art & photos belong here too",
    body: "Upload doodles and moments when they’re fresh. You can tidy captions later.",
  },
  {
    icon: PenTool,
    title: "Writing lives in your studio",
    body: "Poems, stories, journal pages - capture the spark before it fades.",
  },
  {
    icon: Compass,
    title: "Discover fills your wishlist",
    body: "Swipe covers you want next. Friends can suggest gifts from there.",
  },
] as const;

const Login: React.FC = () => {
  usePageAnnouncement("Login");
  usePageMeta({
    title: "Hey Elise - Sign in",
    description: "Sign in to your private Elise Reads studio",
  });
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const profile = useQuery(api.users.getPublicProfile);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const displayName = profile?.name?.trim() || "Elise";

  useEffect(() => {
    let el = document.querySelector(
      'meta[name="robots"]',
    ) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      document.head.appendChild(el);
    }
    el.setAttribute("content", "noindex, nofollow");
    return () => {
      el?.setAttribute("content", "index, follow");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 12% 0%, color-mix(in srgb, var(--color-primary-400) 18%, transparent), transparent 52%), radial-gradient(ellipse at 88% 100%, color-mix(in srgb, var(--color-accent-400) 16%, transparent), transparent 50%), radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--color-violet-300) 12%, transparent), transparent 55%)",
        }}
      />

      <header className="relative z-10 px-4 pt-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Elise Reads home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-primary-700">
              Elise Reads
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 min-h-11 px-2 text-sm font-medium text-slate-500 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Public site
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <motion.div
          className="w-full max-w-5xl grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-14 items-start"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {/* Personal welcome */}
          <div className="text-center lg:text-left lg:pt-2">
            <div className="inline-flex mx-auto lg:mx-0 mb-5 w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-primary-200 to-violet-200 items-center justify-center">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary-600" aria-hidden="true" />
              )}
            </div>

            <p className="text-sm font-semibold tracking-wide text-primary-600 mb-2">
              Your private studio
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 leading-tight mb-3">
              Hey {displayName} - your corner is waiting
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
              Log finished books, hang art and photos, write what you&apos;re
              thinking - visitors only see what you publish on the public site.
            </p>

            <ul className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
              {REMINDERS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-primary-600 shadow-soft">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display font-bold text-slate-800 text-sm">
                      {title}
                    </p>
                    <p className="text-sm text-slate-500 leading-snug mt-0.5">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 inline-flex items-center gap-2 text-sm text-accent-700 font-medium">
              <Heart className="w-4 h-4" aria-hidden="true" />
              Little updates often beat one big catch-up
            </p>
          </div>

          {/* Sign-in card */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white/85 backdrop-blur-sm border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft"
              aria-labelledby="signin-heading"
            >
              <div>
                <h2
                  id="signin-heading"
                  className="font-display font-bold text-xl text-slate-900"
                >
                  Sign in
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Use the email and password for this site.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 p-3.5 bg-error-50 border border-error-100 text-error-700 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium leading-snug">{error}</p>
                    <p className="text-xs text-error-600/80 mt-1 leading-snug">
                      Double-check spelling - or ask for a password reset if
                      you&apos;re stuck.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Your email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10 bg-white"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Your password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 bg-white"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full min-h-12 text-base"
              >
                {loading ? (
                  <span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Open my studio
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  After you sign in
                </p>
                <ul className="text-sm text-slate-500 space-y-1.5 leading-snug">
                  <li>
                    <span className="font-medium text-slate-700">Home</span>
                    {" - "}
                    streaks, currently reading, add a book
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">My Books</span>
                    {" - "}
                    finish books &amp; write reviews
                  </li>
                  <li className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5" aria-hidden="true" />
                      Writing
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5" aria-hidden="true" />
                      Art
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                      Photos
                    </span>
                  </li>
                </ul>
              </div>
            </form>

            <p className="mt-5 text-center lg:text-left text-sm text-slate-500 leading-relaxed">
              Not {displayName}? You can still browse the{" "}
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                public site
              </Link>
              ,{" "}
              <Link
                to="/books"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                books
              </Link>
              , and{" "}
              <Link
                to="/wishlist"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                wishlist
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 pb-6 text-center">
        <p className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          made for reading, drawing &amp; writing
        </p>
      </footer>
    </div>
  );
};

export default Login;
