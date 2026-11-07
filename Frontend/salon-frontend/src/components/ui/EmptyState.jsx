export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center dark:border-ink-700 dark:bg-ink-900/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-500/10">
        <Icon className="h-6 w-6 text-moss-500" />
      </div>
      <h3 className="font-display text-lg text-ink-800 dark:text-cream">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">{description}</p>}
      {action}
    </div>
  );
}
