import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef(({ className, error, label, id, ...props }, ref) => {
  const areaId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={areaId} className="text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>}
      <textarea
        ref={ref}
        id={areaId}
        className={cn(
          "min-h-[100px] rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:border-moss-500",
          "dark:bg-ink-900 dark:border-ink-700 dark:text-ink-50",
          error && "border-clay-500 focus-visible:ring-clay-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-clay-600">{error}</span>}
    </div>
  );
});
Textarea.displayName = "Textarea";
