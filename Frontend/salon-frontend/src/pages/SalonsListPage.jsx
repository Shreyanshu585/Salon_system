import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { salonsApi } from "@/api/salons";
import { SalonCard } from "@/components/feature/SalonCard";
import { SalonCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";

export default function SalonsListPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const debouncedQuery = useDebounce(query);
  const debouncedCity = useDebounce(city);

  const { data: allSalons, isLoading } = useQuery({ queryKey: ["salons", "list"], queryFn: salonsApi.list });

  const { data: searchResults, isFetching: searching } = useQuery({
    queryKey: ["salons", "search", debouncedCity],
    queryFn: () => salonsApi.search(debouncedCity),
    enabled: debouncedCity.trim().length > 0,
  });

  const salons = debouncedCity.trim() ? searchResults : allSalons;

  const filtered = useMemo(() => {
    if (!salons) return [];
    if (!debouncedQuery.trim()) return salons;
    const q = debouncedQuery.toLowerCase();
    return salons.filter((s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
  }, [salons, debouncedQuery]);

  const loading = isLoading || searching;

  return (
    <div className="container-page py-10">
      <span className="eyebrow">Directory</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream sm:text-4xl">Explore salons &amp; spas</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-500 dark:text-ink-400">Search by name or narrow down by city to find your next appointment.</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input placeholder="Search salons by name or address…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
        </div>
        <div className="relative sm:w-56">
          <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input placeholder="Filter by city…" value={city} onChange={(e) => setCity(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => <SalonCardSkeleton key={i} />)}
        {!loading && filtered.map((salon) => <SalonCard key={salon.id} salon={salon} />)}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="mt-8"><EmptyState icon={Search} title="No salons found" description="Try a different search term or clear the city filter." /></div>
      )}
    </div>
  );
}
