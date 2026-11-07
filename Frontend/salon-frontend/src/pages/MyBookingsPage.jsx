import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarX } from "lucide-react";
import { bookingsApi } from "@/api/bookings";
import { salonsApi } from "@/api/salons";
import { servicesApi } from "@/api/services";
import { BookingTicketCard } from "@/components/feature/BookingTicketCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, LinkButton } from "@/components/ui/Button";
import { toast } from "sonner";

function BookingRow({ booking }) {
  const queryClient = useQueryClient();

  const { data: salon } = useQuery({ queryKey: ["salon", booking.salonId], queryFn: () => salonsApi.getById(booking.salonId), staleTime: 5 * 60_000 });

  const { data: serviceList } = useQuery({
    queryKey: ["services", "byIds", booking.serviceIds],
    queryFn: () => servicesApi.getByIds(booking.serviceIds),
    enabled: booking.serviceIds.length > 0,
    staleTime: 5 * 60_000,
  });

  const { mutate: cancel, isPending } = useMutation({
    mutationFn: () => bookingsApi.updateStatus(booking.id, "CANCELLED"),
    onSuccess: () => {
      toast.success("Booking cancelled.");
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
  });

  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <BookingTicketCard
      booking={booking}
      salonName={salon?.name}
      serviceNames={serviceList?.map((s) => s.name)}
      action={canCancel ? <Button variant="outline" size="sm" onClick={() => cancel()} loading={isPending}>Cancel</Button> : undefined}
    />
  );
}

export default function MyBookingsPage() {
  const { data: bookings, isLoading } = useQuery({ queryKey: ["bookings", "mine"], queryFn: bookingsApi.myBookings });

  return (
    <div className="container-page py-10">
      <span className="eyebrow">Your appointments</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream sm:text-4xl">My bookings</h1>
      <div className="mt-8 space-y-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        {!isLoading && (!bookings || bookings.length === 0) && (
          <EmptyState icon={CalendarX} title="No bookings yet" description="Once you book an appointment, it'll show up here as a ticket." action={<LinkButton to="/salons">Browse salons</LinkButton>} />
        )}
        {bookings?.slice().sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).map((b) => <BookingRow key={b.id} booking={b} />)}
      </div>
    </div>
  );
}
