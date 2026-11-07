import { Calendar, Scissors, Store } from "lucide-react";
import { Badge, bookingStatusTone, bookingStatusLabel } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function BookingTicketCard({ booking, salonName, serviceNames, action }) {
  return (
    <div className="ticket flex flex-col sm:flex-row">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
              <Store className="h-3.5 w-3.5" />
              {salonName ?? `Salon #${booking.salonId}`}
            </div>
            <h4 className="mt-1 font-display text-lg text-ink-900 dark:text-cream">Booking #{booking.id}</h4>
          </div>
          <Badge tone={bookingStatusTone(booking)}>{bookingStatusLabel(booking)}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500 dark:text-ink-400">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(booking.startTime)}</span>
          {serviceNames && serviceNames.length > 0 && (
            <span className="flex items-center gap-1.5"><Scissors className="h-3.5 w-3.5" />{serviceNames.join(", ")}</span>
          )}
        </div>
      </div>
      <div className="ticket-stub flex shrink-0 flex-row items-center justify-between gap-3 border-t border-dashed border-ink-100 p-5 sm:w-44 sm:flex-col sm:items-end sm:border-t-0 dark:border-ink-800">
        <div className="text-right">
          <p className="text-xs text-ink-400">Total</p>
          <p className="font-display text-xl text-moss-600 dark:text-moss-300">{formatCurrency(booking.totalPrice)}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
