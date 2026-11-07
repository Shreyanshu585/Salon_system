import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { notificationsApi } from "@/api/notifications";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { RequireSalon } from "./RequireSalon";

function NotificationsForSalon({ salon }) {
  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ["salon-notifications", salon.id],
    queryFn: () => notificationsApi.forSalon(salon.id),
    refetchInterval: 15_000,
  });

  // Everything for this salon EXCEPT the messages addressed to customers.
  const mine = notifications?.filter((n) => n.type !== "BOOKING_CONFIRMED" && n.type !== "BOOKING_DECLINED");

  return (
    <div className="space-y-3">
      {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
      {isError && <p className="text-sm text-clay-600">Couldn't load notifications. Check that notification-service is running.</p>}
      {!isLoading && !isError && (!mine || mine.length === 0) && (
        <EmptyState icon={Bell} title="Nothing here yet" description="You'll be notified when a customer pays for a booking." />
      )}
      {mine
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((n) => (
          <Link key={n.id} to="/owner/bookings" className="card-surface flex items-start gap-3 p-4 transition-colors hover:border-moss-300">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss-500/10">
              <Bell className="h-4 w-4 text-moss-600 dark:text-moss-300" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge tone="gold">New booking</Badge>
              <p className="mt-1 text-sm text-ink-700 dark:text-ink-200">{n.description}</p>
              <p className="mt-1 text-xs text-ink-400">{formatDate(n.createdAt)} · tap to review</p>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default function OwnerNotificationsPage() {
  return (
    <div>
      <span className="eyebrow">Owner dashboard</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">Notifications</h1>
      <div className="mt-6">
        <RequireSalon>{(salon) => <NotificationsForSalon salon={salon} />}</RequireSalon>
      </div>
    </div>
  );
}
