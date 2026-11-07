import { Scissors } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white/60 dark:border-ink-800 dark:bg-ink-900/40">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <div className="flex items-center gap-2 font-display text-lg text-ink-800 dark:text-cream">
          <Scissors className="h-4 w-4 text-moss-500" />
          Booky
        </div>
        <p className="text-sm text-ink-400">&copy; {new Date().getFullYear()} Booky. Booking made effortless.</p>
      </div>
    </footer>
  );
}
