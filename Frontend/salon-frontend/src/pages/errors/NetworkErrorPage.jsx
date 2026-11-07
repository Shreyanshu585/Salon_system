import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NetworkErrorPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 dark:bg-ink-800"><WifiOff className="h-6 w-6 text-ink-500" /></div>
      <h1 className="font-display text-2xl text-ink-900 dark:text-cream">You're offline</h1>
      <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">Check your internet connection — the gateway can't be reached right now.</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );
}
