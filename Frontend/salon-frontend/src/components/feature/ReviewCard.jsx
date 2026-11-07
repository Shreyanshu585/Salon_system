import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/users";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";

export function ReviewCard({ review, canManage, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: author } = useQuery({
    queryKey: ["user", review.userId],
    queryFn: () => usersApi.getById(review.userId),
    staleTime: 5 * 60_000,
  });
  const authorName = author?.fullName ?? "Guest";

  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={authorName} />
          <div>
            <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{authorName}</p>
            <p className="text-xs text-ink-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        {canManage && (
          <div className="relative">
            <button onClick={() => setMenuOpen((o) => !o)} className="rounded-full p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Review options">
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-9 z-10 w-36 rounded-lg border border-ink-100 bg-white py-1 shadow-lg dark:border-ink-800 dark:bg-ink-900">
                <button
                  onClick={() => { setMenuOpen(false); onDelete?.(); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-clay-600 hover:bg-clay-50 dark:hover:bg-clay-900/30"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-3"><StarRating value={review.rating} readOnly size={16} /></div>
      <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{review.reviewText}</p>
    </div>
  );
}
