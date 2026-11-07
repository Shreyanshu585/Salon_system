import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div className={cn("skeleton", className)} />;
}

export function SalonCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
