import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Palette,
  LayoutDashboard,
  LogOut,
  Sparkles,
  MessageSquare,
  Settings,
  Menu,
  X,
  PenTool,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/books", label: "My Books", icon: BookOpen },
  { path: "/dashboard/reviews", label: "Reviews", icon: Star },
  { path: "/dashboard/writing", label: "My Writing", icon: PenTool },
  { path: "/dashboard/art", label: "My Art", icon: Palette },
  { path: "/dashboard/suggestions", label: "Suggestions", icon: MessageSquare },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

// Main layout for protected pages (with sidebar)
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavContent = (onItemClick?: () => void) => (
    <>
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 mb-8"
        onClick={onItemClick}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Elise Reads
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Public Site Link */}
      <Link
        to="/"
        onClick={onItemClick}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 mb-2"
      >
        <Home className="w-5 h-5" />
        View Public Site
      </Link>

      {/* Sign Out */}
      <button
        onClick={() => {
          onItemClick?.();
          signOut();
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Elise Reads
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 p-6 flex flex-col md:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {renderNavContent(() => setMobileMenuOpen(false))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-col h-screen sticky top-0 overflow-y-auto scrollbar-hide">
        {renderNavContent()}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

// Public layout (with header/footer)
export const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: "Books", to: "/books", type: "link" as const },
    { label: "Reviews", to: "/reviews", type: "link" as const },
    { label: "Writing", to: "/writing", type: "link" as const },
    { label: "Art", to: "/art", type: "link" as const },
    { label: "Wishlist", to: "/wishlist", type: "link" as const },
    { label: "About", to: "/about", type: "link" as const },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Elise Reads
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link to="/dashboard" className="btn btn-secondary text-sm">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Sign in
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                {user ? (
                  <Link to="/dashboard" className="btn btn-secondary w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/login" className="text-sm text-slate-400 hover:text-slate-600 px-4 py-3 block" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Made with love for Elise</p>
        </div>
      </footer>
    </div>
  );
};

// Auth layout (centered card)
export const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Elise Reads
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
};
