import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgeIndianRupee, CalendarCheck, CalendarX, Wallet } from "lucide-react";
import { bookingsApi } from "@/api/bookings";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { RequireSalon } from "./RequireSalon";
import { formatCurrency } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, tone }) {
  const toneClasses = {
    moss: "bg-moss-500/10 text-moss-600 dark:text-moss-300",
    gold: "bg-gold-400/15 text-gold-600 dark:text-gold-300",
    clay: "bg-clay-500/10 text-clay-600 dark:text-clay-300",
    ink: "bg-ink-500/10 text-ink-600 dark:text-ink-300",
  }[tone];

  return (
    <Card className="p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${toneClasses}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 font-display text-2xl text-ink-900 dark:text-cream">{value}</p>
    </Card>
  );
}

function Overview() {
  const { data: report, isLoading } = useQuery({
    queryKey: ["salon-report"],
    queryFn: bookingsApi.salonReport,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  const chartData = [
    { name: "Completed", value: (report?.totalBooking ?? 0) - (report?.cancelledBooking ?? 0) },
    { name: "Cancelled", value: report?.cancelledBooking ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Total earnings" value={formatCurrency(report?.totalEarning)} tone="moss" />
        <StatCard icon={CalendarCheck} label="Total bookings" value={String(report?.totalBooking ?? 0)} tone="gold" />
        <StatCard icon={CalendarX} label="Cancelled" value={String(report?.cancelledBooking ?? 0)} tone="clay" />
        <StatCard icon={BadgeIndianRupee} label="Total refunds" value={formatCurrency(report?.totalRefund)} tone="ink" />
      </div>

      <Card className="p-6">
        <h3 className="font-display text-lg text-ink-900 dark:text-cream">Bookings breakdown</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,87,68,0.1)" />
              <XAxis dataKey="name" stroke="#8F7860" fontSize={12} />
              <YAxis stroke="#8F7860" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#FBF7F0", border: "1px solid #EEE7DD", borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="value" fill="#39543F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default function OwnerOverviewPage() {
  return (
    <div>
      <span className="eyebrow">Owner dashboard</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">Overview</h1>
      <div className="mt-6">
        <RequireSalon>{() => <Overview />}</RequireSalon>
      </div>
    </div>
  );
}
