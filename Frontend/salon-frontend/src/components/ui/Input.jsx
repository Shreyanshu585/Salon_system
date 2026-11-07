import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, error, label, hint, id, ...props }, ref) => {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:border-moss-500",
          "dark:bg-ink-900 dark:border-ink-700 dark:text-ink-50",
          error && "border-clay-500 focus-visible:ring-clay-500",
          className
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-ink-400">{hint}</span>}
      {error && <span className="text-xs text-clay-600">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";
