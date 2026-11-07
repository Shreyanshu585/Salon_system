import { ShieldAlert } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 dark:bg-gold-600/20"><ShieldAlert className="h-6 w-6 text-gold-600 dark:text-gold-200" /></div>
      <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Not on the guest list</h1>
      <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">You don't have permission to view this page. If you think this is a mistake, contact support.</p>
      <LinkButton to="/">Back to home</LinkButton>
    </div>
  );
}
