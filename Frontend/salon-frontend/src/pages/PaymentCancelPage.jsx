import { XCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 dark:bg-ink-800"><XCircle className="h-8 w-8 text-ink-500" /></div>
      <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Payment cancelled</h1>
      <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">No worries — your booking wasn't charged. You can pick up where you left off any time.</p>
      <LinkButton to="/salons">Browse salons</LinkButton>
    </div>
  );
}
