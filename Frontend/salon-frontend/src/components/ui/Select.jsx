import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = forwardRef(({ className, error, label, id, children, ...props }, ref) => {
  const selectId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={selectId} className="text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-11 w-full appearance-none rounded-lg border border-ink-200 bg-white px-3.5 pr-9 text-sm text-ink-900 shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:border-moss-500",
            "dark:bg-ink-900 dark:border-ink-700 dark:text-ink-50",
            error && "border-clay-500 focus-visible:ring-clay-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      </div>
      {error && <span className="text-xs text-clay-600">{error}</span>}
    </div>
  );
});
Select.displayName = "Select";
