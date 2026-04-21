import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const sizeStyles: Record<
  InputSize,
  { input: string; icon: string; label: string }
> = {
  sm: {
    input: "px-3 py-1.5 text-sm",
    icon: "w-4 h-4",
    label: "text-xs",
  },
  md: {
    input: "px-4 py-2.5 text-base",
    icon: "w-5 h-5",
    label: "text-sm",
  },
  lg: {
    input: "px-5 py-3 text-lg",
    icon: "w-6 h-6",
    label: "text-base",
  },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth = true,
      className,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id || reactId;
    const styles = sizeStyles[size];
    const hasLeftIcon = icon && iconPosition === "left";
    const hasRightIcon = icon && iconPosition === "right";

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block font-medium text-slate-700 mb-1.5",
              styles.label,
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {hasLeftIcon && (
            <span
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
                styles.icon,
              )}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl font-body transition-all duration-200",
              "bg-white border border-slate-200 focus:border-primary-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-400/30",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100",
              "placeholder:text-slate-400",
              styles.input,
              hasLeftIcon && "pl-10",
              hasRightIcon && "pr-10",
              error &&
                "border-error-500 focus:border-error-500 focus:ring-error-400/30",
              className,
            )}
            {...props}
          />
          {hasRightIcon && (
            <span
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400",
                styles.icon,
              )}
            >
              {icon}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-error-500" : "text-slate-500",
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

type PasswordInputProps = Omit<InputProps, "type" | "icon" | "iconPosition">;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input ref={ref} type={showPassword ? "text" : "password"} {...props} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-[38px] p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  fullWidth?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      size = "md",
      fullWidth = true,
      showCount = false,
      maxLength,
      className,
      disabled,
      id,
      value,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id || reactId;
    const styles = sizeStyles[size];
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block font-medium text-slate-700 mb-1.5",
              styles.label,
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          value={value}
          maxLength={maxLength}
          className={cn(
            "w-full rounded-xl font-body transition-all duration-200 resize-none",
            "bg-white border border-slate-200 focus:border-primary-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-400/30",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100",
            "placeholder:text-slate-400",
            styles.input,
            error &&
              "border-error-500 focus:border-error-500 focus:ring-error-400/30",
            className,
          )}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {(error || hint) && (
            <p
              className={cn(
                "text-xs",
                error ? "text-error-500" : "text-slate-500",
              )}
            >
              {error || hint}
            </p>
          )}
          {showCount && (
            <p
              className={cn(
                "text-xs text-slate-400 ml-auto",
                maxLength && charCount >= maxLength && "text-error-500",
              )}
            >
              {charCount}
              {maxLength ? `/${maxLength}` : ""} characters
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Input;
