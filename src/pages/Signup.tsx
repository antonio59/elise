import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import AuthFormLayout from "../components/auth/AuthFormLayout";

const Signup: React.FC = () => {
  usePageAnnouncement("Signup");
  usePageMeta({ title: "Sign up", description: "Create an account" });
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, name);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create account";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Create Account"
      subtitle="Start your reading adventure!"
      error={error}
      loading={loading}
      submitLabel="Create Account"
      loadingLabel="Creating account..."
      onSubmit={handleSubmit}
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input pl-10"
            placeholder="Your name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input pl-10"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pl-10"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default Signup;
