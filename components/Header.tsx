"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api, useAuth } from "@/lib/convex";
import {
  dropdownVariants,
  mobileMenuVariants,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import {
  Book,
  Palette,
  PenLine,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Shield,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const siteSettings = useQuery(api.siteSettings.get);

  const siteName = siteSettings?.siteName || "Elise Reads";

  // Public navigation items
  const publicNavItems = [
    { href: "/", label: "Bookshelf", icon: Book },
    { href: "/gallery", label: "Gallery", icon: Palette },
    { href: "/reviews", label: "Reviews", icon: PenLine },
  ];

  // Admin navigation items (only shown when in admin mode)
  const adminNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin", label: "Manage", icon: Settings },
  ];

  const navItems =
    isAdminMode && user
      ? [...publicNavItems, ...adminNavItems]
      : publicNavItems;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setIsAdminMode(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg z-50 border-b border-gray-100 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            className="text-2xl"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            📚
          </motion.span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {siteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
          ) : user ? (
            <div className="relative flex items-center">
              {/* Admin Mode Toggle */}
              <motion.button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`mr-2 p-2 rounded-lg transition-all duration-200 ${
                  isAdminMode
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                }`}
                title={isAdminMode ? "Exit Admin Mode" : "Enter Admin Mode"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield size={18} />
              </motion.button>

              {/* User Avatar Button */}
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar
                  src={user.avatarUrl}
                  fallback={user.username || user.email}
                  size="sm"
                />
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <motion.div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-800 py-2 z-50 overflow-hidden"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {user.username || "User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <motion.div
                        className="py-1"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div variants={staggerItem}>
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                          >
                            <User size={16} />
                            <span>Profile</span>
                          </Link>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                          >
                            <LayoutDashboard size={16} />
                            <span>Dashboard</span>
                          </Link>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                          >
                            <Settings size={16} />
                            <span>Manage</span>
                          </Link>
                        </motion.div>
                      </motion.div>

                      <div className="border-t border-gray-100 dark:border-neutral-800 py-1">
                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          <div className="space-y-1.5">
            <motion.span
              className="block h-0.5 w-6 bg-gray-600 dark:bg-gray-300"
              animate={{
                rotate: mobileOpen ? 45 : 0,
                y: mobileOpen ? 8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-gray-600 dark:bg-gray-300"
              animate={{
                opacity: mobileOpen ? 0 : 1,
                scaleX: mobileOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-gray-600 dark:bg-gray-300"
              animate={{
                rotate: mobileOpen ? -45 : 0,
                y: mobileOpen ? -8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="px-4 py-4 space-y-1"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.href} variants={staggerItem}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive(item.href)
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Mobile User Section */}
            <motion.div
              className="px-4 py-4 border-t border-gray-100 dark:border-neutral-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user ? (
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center gap-3 px-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Avatar
                      src={user.avatarUrl}
                      fallback={user.username || user.email}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.username || "User"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </motion.div>

                  {/* Admin Mode Toggle - Mobile */}
                  <motion.button
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all ${
                      isAdminMode
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Shield size={18} />
                    {isAdminMode ? "Exit Admin Mode" : "Admin Mode"}
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="secondary" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
