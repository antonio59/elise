"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/convex";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { Mail, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(error.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Welcome Back!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Sign in to your bookshelf
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Lock size={18} />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Sign In
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
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Fun decoration */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
            <Sparkles size={14} />
            <span>Ready to explore new worlds?</span>
            <Sparkles size={14} />
          </div>
        </div>
      </div>
    </main>
  );
}
