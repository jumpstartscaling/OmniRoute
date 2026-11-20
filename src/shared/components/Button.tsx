"use client";

import { cn } from "@/shared/utils/cn";

const variants = {
  primary: "bg-primary text-black hover:brightness-95",
  accent: "bg-accent text-white dark:text-black hover:brightness-95",
  secondary:
    "bg-white dark:bg-black border border-border text-text-main hover:bg-black/5 dark:hover:bg-white/10",
  outline: "border border-border text-text-main hover:bg-black/5 dark:hover:bg-white/10",
  ghost: "text-text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-main",
  warning: "jos-warning-fill hover:brightness-110",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
};

export type ButtonVariant = keyof typeof variants;

const sizes = {
  sm: "h-7 px-3 text-xs rounded-control",
  md: "h-9 px-4 text-sm rounded-control",
  lg: "h-11 px-6 text-sm rounded-control",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer",
        "active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          className="material-symbols-outlined animate-spin text-[18px] pointer-events-none"
          aria-hidden="true"
        >
          progress_activity
        </span>
      ) : icon ? (
        <span
          className="material-symbols-outlined text-[18px] pointer-events-none"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span
          className="material-symbols-outlined text-[18px] pointer-events-none"
          aria-hidden="true"
        >
          {iconRight}
        </span>
      )}
    </button>
  );
}
