import { useQuery } from "@tanstack/react-query";
import { salonsApi } from "@/api/salons";
import { useAuth } from "@/contexts/AuthContext";

export function useMySalon() {
  const { isSalonOwner, authenticated } = useAuth();
  return useQuery({
    queryKey: ["my-salon"],
    queryFn: salonsApi.getMySalon,
    enabled: authenticated && isSalonOwner,
    retry: false,
  });
}
