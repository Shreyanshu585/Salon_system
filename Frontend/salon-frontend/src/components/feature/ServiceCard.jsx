import { Check, Clock } from "lucide-react";
import { cn, formatCurrency, minutesToLabel } from "@/lib/utils";

export function ServiceCard({ service, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl2 border p-4 text-left transition-colors",
        selected ? "border-moss-500 bg-moss-50 dark:bg-moss-900/20" : "border-ink-100 bg-white hover:border-moss-300 dark:border-ink-800 dark:bg-ink-900"
      )}
    >
      {service.image && (
        <img src={service.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
      )}
      <div className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", selected ? "border-moss-500 bg-moss-500 text-cream" : "border-ink-300 dark:border-ink-600")}>
        {selected && <Check className="h-3 w-3" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-medium text-ink-900 dark:text-cream">{service.name}</h4>
          <span className="shrink-0 font-display text-lg text-moss-600 dark:text-moss-300">{formatCurrency(service.price)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{service.description}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-ink-400">
          <Clock className="h-3 w-3" />
          {minutesToLabel(service.duration)}
        </div>
      </div>
    </button>
  );
}
