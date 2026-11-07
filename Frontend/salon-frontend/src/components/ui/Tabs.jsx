import { cn } from "@/lib/utils";

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-full bg-ink-100 p-1 dark:bg-ink-800">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active === tab.key ? "bg-white text-ink-900 shadow-soft dark:bg-ink-950 dark:text-cream" : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
