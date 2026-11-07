import { Store } from "lucide-react";
import { useMySalon } from "@/hooks/useMySalon";
import { FullscreenLoader } from "@/components/ui/FullscreenLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

/** Gates owner-only pages that need a salon to already exist. */
export function RequireSalon({ children }) {
  const { data: salon, isLoading, isError } = useMySalon();

  if (isLoading) return <FullscreenLoader label="Loading your salon…" />;

  if (isError || !salon) {
    return (
      <EmptyState
        icon={Store}
        title="Set up your salon first"
        description="Create your salon profile to start adding categories, services, and taking bookings."
        action={<LinkButton to="/owner/salon">Create my salon</LinkButton>}
      />
    );
  }

  return <>{children(salon)}</>;
}
