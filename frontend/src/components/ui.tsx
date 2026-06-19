/**
 * Reusable UI Components
 * Built with Tailwind CSS — no external component library needed.
 * Clean, modern design that looks professional in a portfolio.
 */

import { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  loading,
  className,
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-md hover:shadow-lg",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-indigo-500 shadow-sm",
    ghost: "hover:bg-gray-100 text-gray-600 focus:ring-gray-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("bg-white rounded-2xl border border-gray-100 shadow-sm", className)}>
      {children}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      <textarea
        className={clsx(
          "w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          "placeholder:text-gray-400 resize-none transition-all",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      <input
        className={clsx(
          "w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          "placeholder:text-gray-400 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={clsx(
          "w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          "transition-all cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────

export function LoadingSpinner({ message = "Generating..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-100" />
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-gray-500 animate-pulse">{message}</p>
    </div>
  );
}

// ─── Result Box ───────────────────────────────────────────────────────────────

interface ResultBoxProps {
  result: string;
  onCopy?: () => void;
  label?: string;
}

export function ResultBox({ result, onCopy, label = "Generated Result" }: ResultBoxProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    onCopy?.();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </Button>
      </div>
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
          {result}
        </pre>
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  generate: "bg-purple-100 text-purple-700",
  rewrite: "bg-blue-100 text-blue-700",
  tone_change: "bg-green-100 text-green-700",
  subject: "bg-yellow-100 text-yellow-700",
  reply: "bg-pink-100 text-pink-700",
  summarize: "bg-orange-100 text-orange-700",
};

export function ActionBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    generate: "Generate",
    rewrite: "Rewrite",
    tone_change: "Tone",
    subject: "Subject",
    reply: "Reply",
    summarize: "Summarize",
  };

  return (
    <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", ACTION_COLORS[type] || "bg-gray-100 text-gray-600")}>
      {labels[type] || type}
    </span>
  );
}