import { ServerCrash } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";

export default function ServerErrorPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-100 dark:bg-clay-900/40"><ServerCrash className="h-6 w-6 text-clay-600 dark:text-clay-300" /></div>
      <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Our end, not yours</h1>
      <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">Something went wrong on the server. Please try again in a moment.</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>Try again</Button>
        <LinkButton to="/">Back to home</LinkButton>
      </div>
    </div>
  );
}
