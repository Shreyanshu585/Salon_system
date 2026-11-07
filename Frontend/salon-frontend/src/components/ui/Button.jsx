import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-moss-500 text-cream hover:bg-moss-600 active:bg-moss-700 shadow-soft disabled:bg-moss-300",
  secondary: "bg-ink-900 text-cream hover:bg-ink-800 active:bg-ink-700 dark:bg-cream dark:text-ink-900 dark:hover:bg-ink-100",
  outline: "border border-ink-200 text-ink-800 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800 bg-transparent",
  ghost: "text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 bg-transparent",
  destructive: "bg-clay-500 text-cream hover:bg-clay-600 active:bg-clay-700",
  gold: "bg-gold-400 text-ink-900 hover:bg-gold-300 active:bg-gold-500 shadow-soft",
};

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2",
  icon: "h-10 w-10 shrink-0",
};

export function buttonClasses(variant = "primary", size = "md", className) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60",
    "focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream dark:focus-visible:ring-offset-ink-950",
    variants[variant],
    sizes[size],
    className
  );
}

export const Button = forwardRef(({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
  return (
    <button ref={ref} disabled={disabled || loading} className={cn(buttonClasses(variant, size), className)} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = "Button";

export function LinkButton({ variant = "primary", size = "md", className, ...props }) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

export function AnchorButton({ variant = "primary", size = "md", className, ...props }) {
  return <a className={buttonClasses(variant, size, className)} {...props} />;
}
