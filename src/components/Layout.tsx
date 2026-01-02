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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/books", label: "My Books", icon: BookOpen },
  { path: "/art", label: "My Art", icon: Palette },
  { path: "/suggestions", label: "Suggestions", icon: MessageSquare },
  { path: "/settings", label: "Settings", icon: Settings },
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
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
                  ? "bg-gradient-to-r from-primary-500 to-violet-500 text-white shadow-md"
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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
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
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-col min-h-screen sticky top-0">
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
              Elise Reads
            </span>
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            <a
              href="/#books"
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              Books
            </a>
            <Link
              to="/wishlist"
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              Wishlist
            </Link>
            <Link
              to="/gallery"
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              Gallery
            </Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-gradient text-sm">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary text-sm">
                Sign In
              </Link>
            )}
          </nav>
        </div>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
            Elise Reads
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
};
