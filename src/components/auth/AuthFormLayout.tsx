import React from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

interface AuthFormLayoutProps {
  title: string;
  subtitle: string;
  error: string;
  loading: boolean;
  submitLabel: string;
  loadingLabel: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  subtitle,
  error,
  loading,
  submitLabel,
  loadingLabel,
  children,
  footer,
  onSubmit,
}) => {
  return (
    <motion.div
      className="card p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
      <p className="text-slate-500 text-center mb-6">{subtitle}</p>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 bg-error-50 text-error-600 rounded-xl mb-4"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {children}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {loadingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>

      <p className="text-center text-slate-500 mt-6">{footer}</p>
    </motion.div>
  );
};

export default AuthFormLayout;
