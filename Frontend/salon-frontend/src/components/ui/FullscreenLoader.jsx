import { Scissors } from "lucide-react";

export function FullscreenLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream dark:bg-ink-950">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-moss-500/10">
        <Scissors className="h-6 w-6 animate-pulse text-moss-500" />
      </div>
      <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  );
}
