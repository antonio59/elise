import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs));
}

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const toastStyles: Record<
  ToastType,
  { bg: string; icon: React.ReactNode; iconBg: string }
> = {
  success: {
    bg: "bg-slate-50 border-success-200",
    icon: <CheckCircle className="w-5 h-5 text-success-500" />,
    iconBg: "bg-success-50",
  },
  error: {
    bg: "bg-slate-50 border-error-200",
    icon: <AlertCircle className="w-5 h-5 text-error-500" />,
    iconBg: "bg-error-50",
  },
  warning: {
    bg: "bg-slate-50 border-accent-200",
    icon: <AlertTriangle className="w-5 h-5 text-accent-600" />,
    iconBg: "bg-accent-50",
  },
  info: {
    bg: "bg-slate-50 border-primary-200",
    icon: <Info className="w-5 h-5 text-primary-500" />,
    iconBg: "bg-primary-50",
  },
};

function ToastItem({ toast, onClose }: ToastItemProps) {
  const styles = toastStyles[toast.type];

  return (
    <motion.div
      layout
      initial={useReducedMotion() ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={useReducedMotion() ? { opacity: 0 } : { opacity: 0, x: 100, scale: 0.95 }}
      transition={useReducedMotion() ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg",
        styles.bg,
      )}
    >
      <div className={cn("p-1.5 rounded-lg", styles.iconBg)}>{styles.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-slate-500 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

