import { cn } from "@/lib/utils";

const tones = {
  moss: "bg-moss-100 text-moss-700 dark:bg-moss-900/40 dark:text-moss-200",
  clay: "bg-clay-100 text-clay-700 dark:bg-clay-900/40 dark:text-clay-200",
  gold: "bg-gold-100 text-gold-600 dark:bg-gold-600/20 dark:text-gold-200",
  ink: "bg-ink-800 text-cream",
  neutral: "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300",
};

export function Badge({ tone = "neutral", className, ...props }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)} {...props} />;
}

// Takes the whole booking: PENDING + paid means "paid, waiting for the owner".
export function bookingStatusTone(booking) {
  if (booking.status === "CONFIRMED") return "moss";
  if (booking.status === "CANCELLED") return "clay";
  return booking.paid ? "gold" : "neutral";
}

export function bookingStatusLabel(booking) {
  if (booking.status === "CONFIRMED") return "Confirmed";
  if (booking.status === "CANCELLED") return "Cancelled";
  return booking.paid ? "Paid · waiting for salon to confirm" : "Awaiting payment";
}

export function paymentStatusTone(status) {
  if (status === "SUCCESS") return "moss";
  if (status === "FAILED") return "clay";
  return "gold";
}
