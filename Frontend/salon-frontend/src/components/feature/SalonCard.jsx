import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { formatTime } from "@/lib/utils";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=60";

export function SalonCard({ salon }) {
  const image = salon.images?.[0] || FALLBACK_IMG;
  return (
    <Link to={`/salons/${salon.id}`} className="card-surface group block overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={image}
          alt={salon.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-950/60 to-transparent" />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="truncate font-display text-lg text-ink-900 dark:text-cream">{salon.name}</h3>
        <div className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{salon.address}, {salon.city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{formatTime(salon.openTime)} – {formatTime(salon.closeTime)}</span>
        </div>
      </div>
    </Link>
  );
}
