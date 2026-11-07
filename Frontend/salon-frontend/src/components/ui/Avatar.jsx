import { initials, cn } from "@/lib/utils";

export function Avatar({ name, className }) {
  return (
    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-moss-500 text-xs font-semibold text-cream", className)}>
      {initials(name)}
    </div>
  );
}
