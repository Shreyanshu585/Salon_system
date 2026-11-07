import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, BellRing, CheckCheck } from "lucide-react";
import { notificationsApi } from "@/api/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate, cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: all, isLoading } = useQuery({
    queryKey: ["notifications", "mine", profile?.id],
    queryFn: () => notificationsApi.forUser(profile.id),
    enabled: !!profile?.id,
    refetchInterval: 30_000,
  });

  // Customers only see what the salon decided about their booking.
  const notifications = all?.filter((n) => n.type === "BOOKING_CONFIRMED" || n.type === "BOOKING_DECLINED");

  const { mutate: markRead } = useMutation({
    mutationFn: (id) => notificationsApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div className="container-page py-10">
      <span className="eyebrow">Stay in the loop</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream sm:text-4xl">Notifications</h1>
      <div className="mt-8 space-y-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        {!isLoading && (!notifications || notifications.length === 0) && (
          <EmptyState icon={Bell} title="Nothing here yet" description="You'll hear back here when a salon confirms or declines your booking." />
        )}
        {notifications?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((n) => (
          <button
            key={n.id}
            onClick={() => !n.isRead && markRead(n.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-xl2 border p-4 text-left transition-colors",
              n.isRead ? "border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900" : "border-moss-300 bg-moss-50 dark:border-moss-700 dark:bg-moss-900/20"
            )}
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss-500/10">
              {n.isRead ? <Bell className="h-4 w-4 text-ink-400" /> : <BellRing className="h-4 w-4 text-moss-600 dark:text-moss-300" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge tone={n.type === "BOOKING_DECLINED" ? "clay" : "moss"}>
                  {n.type === "BOOKING_DECLINED" ? "Declined" : "Confirmed"}
                </Badge>
                {!n.isRead && <CheckCheck className="h-3.5 w-3.5 text-moss-500" />}
              </div>
              <p className="mt-1 text-sm text-ink-700 dark:text-ink-200">{n.description}</p>
              <p className="mt-1 text-xs text-ink-400">{formatDate(n.createdAt)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
