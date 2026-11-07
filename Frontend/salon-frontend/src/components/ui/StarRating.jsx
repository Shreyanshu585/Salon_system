import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ value, onChange, size = 18, readOnly = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn("transition-transform", !readOnly && "hover:scale-110 cursor-pointer")}
          aria-label={`${star} star`}
        >
          <Star size={size} className={star <= Math.round(value) ? "fill-gold-400 text-gold-400" : "text-ink-200 dark:text-ink-700"} />
        </button>
      ))}
    </div>
  );
}
