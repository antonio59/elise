"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api, useAuth } from "@/lib/convex";
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

  const siteName = siteSettings?.siteName || "Elise's World";

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {siteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
          ) : user ? (
            <div className="relative">
              {/* Admin Mode Toggle */}
              {user && (
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`mr-2 p-2 rounded-full transition-all duration-200 ${
                    isAdminMode
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                  title={isAdminMode ? "Exit Admin Mode" : "Enter Admin Mode"}
                >
                  <Shield size={18} />
                </button>
              )}

              {/* User Avatar Button */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Avatar
                  src={user.avatarUrl}
                  fallback={user.username || user.email}
                  size="sm"
                />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-800 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user.username || "User"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      {user.role === "parent" && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-purple-600 dark:text-purple-400">
                          <Shield size={12} /> Parent Account
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>
                      {user.role === "parent" && (
                        <Link
                          href="/parent"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                        >
                          <Shield size={16} />
                          <span>Parent Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-800 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
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
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile User Section */}
          <div className="px-4 py-4 border-t border-gray-100 dark:border-neutral-800">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
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
                </div>

                {/* Admin Mode Toggle - Mobile */}
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all ${
                    isAdminMode
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Shield size={18} />
                  {isAdminMode ? "Exit Admin Mode" : "Admin Mode"}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
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
          </div>
        </div>
      )}
    </header>
  );
}
