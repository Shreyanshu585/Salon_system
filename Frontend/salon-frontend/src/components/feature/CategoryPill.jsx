import { cn } from "@/lib/utils";

export function CategoryPill({ category, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active ? "border-moss-500 bg-moss-500 text-cream" : "border-ink-200 bg-white text-ink-600 hover:border-moss-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
      )}
    >
      {category.image && (
        <img src={category.image} alt="" className="h-5 w-5 rounded-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
      )}
      {category.name}
    </button>
  );
}
