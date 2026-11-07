import { Scissors } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-display text-8xl text-moss-500/20">404</span>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-500/10"><Scissors className="h-6 w-6 text-moss-500" /></div>
      <h1 className="font-display text-2xl text-ink-900 dark:text-cream">This chair's empty</h1>
      <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">We couldn't find the page you were looking for. It may have moved or never existed.</p>
      <LinkButton to="/">Back to home</LinkButton>
    </div>
  );
}
