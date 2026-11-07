import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("card-surface", className)} {...props} />;
}
export function CardHeader({ className, ...props }) {
  return <div className={cn("p-5 sm:p-6 pb-0", className)} {...props} />;
}
export function CardContent({ className, ...props }) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}
export function CardFooter({ className, ...props }) {
  return <div className={cn("p-5 sm:p-6 pt-0 flex items-center gap-3", className)} {...props} />;
}
