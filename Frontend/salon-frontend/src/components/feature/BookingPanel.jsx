import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarDays, CreditCard, Loader2 } from "lucide-react";
import { addDays, format } from "date-fns";
import { bookingsApi } from "@/api/bookings";
import { Button } from "@/components/ui/Button";
import { SlotPicker } from "./SlotPicker";
import { cn, formatCurrency, minutesToLabel } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const DAYS_AHEAD = 7;

export function BookingPanel({ salon, selected }) {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [slot, setSlot] = useState(null);
  const [method, setMethod] = useState("RAZORPAY");

  const dayOptions = useMemo(() => Array.from({ length: DAYS_AHEAD }).map((_, i) => addDays(new Date(), i)), []);

  const { data: bookedSlots, isLoading: loadingSlots } = useQuery({
    queryKey: ["booked-slots", salon.id, date],
    queryFn: () => bookingsApi.bookedSlots(salon.id, date),
  });

  const totalPrice = selected.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selected.reduce((sum, s) => sum + s.duration, 0);

  const { mutate: book, isPending } = useMutation({
    mutationFn: () =>
      bookingsApi.create(salon.id, method, { startTime: `${date}T${slot}`, serviceIds: selected.map((s) => s.id) }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["booked-slots"] });
      window.location.href = res.payment_link_url;
    },
    onError: () => toast.error("Couldn't start your booking. Please try again."),
  });

  function handleBook() {
    if (!authenticated) return navigate("/login", { state: { from: location } });
    if (selected.length === 0) return toast.error("Select at least one service first.");
    if (!slot) return toast.error("Pick a time slot.");
    book();
  }

  return (
    <div className="card-surface sticky top-24 p-5">
      <h3 className="font-display text-lg text-ink-900 dark:text-cream">Book your appointment</h3>

      <div className="mt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400"><CalendarDays className="h-3.5 w-3.5" /> Choose a day</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {dayOptions.map((d) => {
            const value = format(d, "yyyy-MM-dd");
            const isActive = value === date;
            return (
              <button
                key={value}
                onClick={() => { setDate(value); setSlot(null); }}
                className={cn(
                  "flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                  isActive ? "border-moss-500 bg-moss-500 text-cream" : "border-ink-200 bg-white text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
                )}
              >
                <span>{format(d, "EEE")}</span>
                <span className="font-display text-base">{format(d, "d")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Available slots</p>
        {loadingSlots ? (
          <div className="flex h-16 items-center justify-center text-ink-400"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <SlotPicker openTime={salon.openTime} closeTime={salon.closeTime} bookedSlots={bookedSlots ?? []} selected={slot} onSelect={setSlot} date={date} />
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Pay with</p>
        <div className="grid grid-cols-2 gap-2">
          {["RAZORPAY", "STRIPE"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                method === m ? "border-moss-500 bg-moss-500 text-cream" : "border-ink-200 bg-white text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
              )}
            >
              <CreditCard className="h-3.5 w-3.5" />
              {m === "RAZORPAY" ? "Razorpay" : "Card (Stripe)"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-1.5 border-t border-dashed border-ink-100 pt-4 text-sm dark:border-ink-800">
        <div className="flex justify-between text-ink-500 dark:text-ink-400">
          <span>{selected.length} service{selected.length === 1 ? "" : "s"} selected</span>
          <span>{totalDuration ? minutesToLabel(totalDuration) : "—"}</span>
        </div>
        <div className="flex justify-between font-display text-xl text-ink-900 dark:text-cream">
          <span>Total</span>
          <span className="text-moss-600 dark:text-moss-300">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <Button className="mt-5 w-full" size="lg" onClick={handleBook} loading={isPending}>
        {authenticated ? "Book & pay" : "Sign in to book"}
      </Button>
    </div>
  );
}
