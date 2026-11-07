import { useMemo } from "react";
import { cn, formatTime } from "@/lib/utils";

const STEP_MINUTES = 30;

function buildSlots(openTime, closeTime) {
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  const slots = [];
  let mins = oh * 60 + om;
  const end = ch * 60 + cm;
  while (mins + STEP_MINUTES <= end) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
    mins += STEP_MINUTES;
  }
  return slots;
}

// `date` is "yyyy-MM-dd", `slot` is "HH:mm:ss" -> a local Date
function toDate(date, slot) {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, m] = slot.split(":").map(Number);
  return new Date(y, mo - 1, d, h, m, 0, 0);
}

export function SlotPicker({ openTime, closeTime, bookedSlots = [], selected, onSelect, date: dateProp }) {
  // fall back to today so a missing prop can never crash the page
  const date = dateProp ?? new Date().toLocaleDateString("en-CA");
  const slots = useMemo(() => buildSlots(openTime, closeTime), [openTime, closeTime]);

  const bookedRanges = useMemo(
    () => bookedSlots.map((b) => ({ start: new Date(b.startTime).getTime(), end: new Date(b.endTime).getTime() })),
    [bookedSlots]
  );

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {slots.map((slot) => {
        const start = toDate(date, slot).getTime();
        const end = start + STEP_MINUTES * 60_000;

        const isPast = start <= Date.now();
        const isBooked = bookedRanges.some((r) => start < r.end && end > r.start);
        const unavailable = isPast || isBooked;
        const isSelected = selected === slot;

        return (
          <button
            key={slot}
            type="button"
            disabled={unavailable}
            onClick={() => onSelect(slot)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              unavailable && "cursor-not-allowed border-ink-100 bg-ink-50 text-ink-300 line-through dark:border-ink-800 dark:bg-ink-900 dark:text-ink-600",
              !unavailable && !isSelected && "border-ink-200 bg-white text-ink-700 hover:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200",
              isSelected && "border-moss-500 bg-moss-500 text-cream"
            )}
          >
            {formatTime(slot)}
          </button>
        );
      })}
    </div>
  );
}
