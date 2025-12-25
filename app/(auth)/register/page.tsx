"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/convex";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { Mail, Lock, Sparkles, BookOpen, Users } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"child" | "parent">("child");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await register(email, password, role);
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(error.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Join the Adventure!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Create your bookshelf account
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Account Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("child")}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    role === "child"
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                      : "border-gray-200 dark:border-neutral-700 hover:border-pink-300 dark:hover:border-pink-800"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <BookOpen
                      className={`w-6 h-6 ${role === "child" ? "text-pink-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div
                    className={`font-semibold ${role === "child" ? "text-pink-600 dark:text-pink-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    Reader
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    For kids
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("parent")}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    role === "parent"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-800"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users
                      className={`w-6 h-6 ${role === "parent" ? "text-purple-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div
                    className={`font-semibold ${role === "parent" ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    Parent
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Manage content
                  </div>
                </button>
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                leftIcon={<Lock size={18} />}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1">
                At least 6 characters
              </p>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              leftIcon={<Lock size={18} />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Create Account
            </Button>

            {message && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {message}
                </p>
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Fun decoration */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
            <Sparkles size={14} />
            <span>Start your reading adventure today!</span>
            <Sparkles size={14} />
          </div>
        </div>
      </div>
    </main>
  );
}
