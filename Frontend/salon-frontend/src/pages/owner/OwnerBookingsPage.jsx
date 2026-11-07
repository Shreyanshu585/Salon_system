import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarX } from "lucide-react";
import { toast } from "sonner";
import { bookingsApi } from "@/api/bookings";
import { servicesApi } from "@/api/services";
import { usersApi } from "@/api/users";
import { BookingTicketCard } from "@/components/feature/BookingTicketCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { RequireSalon } from "./RequireSalon";

function OwnerBookingRow({ booking, salonName }) {
  const queryClient = useQueryClient();

  const { data: customer } = useQuery({
    queryKey: ["user", booking.customerId],
    queryFn: () => usersApi.getById(booking.customerId),
    staleTime: 5 * 60_000,
  });

  const { data: serviceList } = useQuery({
    queryKey: ["services", "byIds", booking.serviceIds],
    queryFn: () => servicesApi.getByIds(booking.serviceIds),
    enabled: booking.serviceIds.length > 0,
    staleTime: 5 * 60_000,
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (status) => bookingsApi.updateStatus(booking.id, status),
    onSuccess: () => {
      toast.success("Booking updated — the customer has been notified.");
      queryClient.invalidateQueries({ queryKey: ["salon-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["salon-report"] });
    },
  });

  // Paid + still PENDING = waiting for the owner's decision.
  const waitingForOwner = booking.status === "PENDING" && booking.paid;

  return (
    <BookingTicketCard
      booking={booking}
      salonName={`${salonName} · ${customer?.fullName ?? "Customer"}`}
      serviceNames={serviceList?.map((s) => s.name)}
      action={
        waitingForOwner ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => updateStatus("CONFIRMED")} loading={isPending}>Confirm</Button>
            <Button size="sm" variant="outline" onClick={() => updateStatus("CANCELLED")} loading={isPending}>Decline</Button>
          </div>
        ) : undefined
      }
    />
  );
}

function BookingsForSalon({ salon }) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["salon-bookings"],
    queryFn: bookingsApi.salonBookings,
    refetchInterval: 20_000,
  });

  // Hide bookings the customer hasn't paid for yet.
  const visible = bookings?.filter((b) => !(b.status === "PENDING" && !b.paid));

  return (
    <div className="space-y-4">
      {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      {!isLoading && (!visible || visible.length === 0) && (
        <EmptyState icon={CalendarX} title="No bookings yet" description="Paid bookings from customers will show up here." />
      )}
      {visible
        ?.slice()
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .map((b) => <OwnerBookingRow key={b.id} booking={b} salonName={salon.name} />)}
    </div>
  );
}

export default function OwnerBookingsPage() {
  return (
    <div>
      <span className="eyebrow">Owner dashboard</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">Bookings</h1>
      <div className="mt-6">
        <RequireSalon>{(salon) => <BookingsForSalon salon={salon} />}</RequireSalon>
      </div>
    </div>
  );
}
