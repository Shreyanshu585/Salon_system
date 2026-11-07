import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { salonsApi } from "@/api/salons";
import { categoriesApi } from "@/api/categories";
import { servicesApi } from "@/api/services";
import { reviewsApi } from "@/api/reviews";
import { CategoryPill } from "@/components/feature/CategoryPill";
import { ServiceCard } from "@/components/feature/ServiceCard";
import { ReviewCard } from "@/components/feature/ReviewCard";
import { BookingPanel } from "@/components/feature/BookingPanel";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { StarRating } from "@/components/ui/StarRating";
import { FullscreenLoader } from "@/components/ui/FullscreenLoader";
import { useAuth } from "@/contexts/AuthContext";
import { formatTime } from "@/lib/utils";
import { toast } from "sonner";

const reviewSchema = z.object({
  reviewText: z.string().min(5, "Tell us a bit more (5+ characters)."),
  rating: z.number().min(1, "Pick a rating").max(5),
});

function SalonDetail() {
  const { salonId } = useParams();
  const id = Number(salonId);
  const { authenticated, profile } = useAuth();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState("services");
  const [activeCategory, setActiveCategory] = useState(null);
  const [selected, setSelected] = useState([]);

  const { data: salon, isLoading: loadingSalon } = useQuery({ queryKey: ["salon", id], queryFn: () => salonsApi.getById(id), enabled: !!id });

  const { data: categories } = useQuery({ queryKey: ["categories", "salon", id], queryFn: () => categoriesApi.bySalon(id), enabled: !!id });

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["services", "salon", id, activeCategory],
    queryFn: () => servicesApi.bySalon(id, activeCategory ?? undefined),
    enabled: !!id,
  });

  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", "salon", id],
    queryFn: () => reviewsApi.bySalon(id),
    enabled: !!id && authenticated,
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { reviewText: "", rating: 5 },
  });

  const { mutate: submitReview, isPending: submittingReview } = useMutation({
    mutationFn: (payload) => reviewsApi.create(id, payload),
    onSuccess: () => {
      toast.success("Review posted!");
      reset({ reviewText: "", rating: 5 });
      queryClient.invalidateQueries({ queryKey: ["reviews", "salon", id] });
    },
  });

  const { mutate: deleteReview } = useMutation({
    mutationFn: (reviewId) => reviewsApi.remove(reviewId),
    onSuccess: () => {
      toast.success("Review removed.");
      queryClient.invalidateQueries({ queryKey: ["reviews", "salon", id] });
    },
  });

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  function toggleService(service) {
    setSelected((prev) => (prev.some((s) => s.id === service.id) ? prev.filter((s) => s.id !== service.id) : [...prev, service]));
  }

  if (loadingSalon) return <FullscreenLoader label="Loading salon…" />;
  if (!salon)
    return (
      <div className="container-page py-16"><EmptyState icon={MapPin} title="Salon not found" description="This salon may no longer be listed." /></div>
    );

  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <img
          src={salon.images?.[0] || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=60"}
          alt={salon.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-6 text-cream">
          <h1 className="font-display text-3xl sm:text-4xl">{salon.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-cream/85">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {salon.address}, {salon.city}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {formatTime(salon.openTime)} – {formatTime(salon.closeTime)}</span>
            {avgRating !== null && (
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {avgRating.toFixed(1)} ({reviews?.length})</span>
            )}
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs
            tabs={[{ key: "services", label: "Services" }, { key: "reviews", label: "Reviews" }, { key: "about", label: "About" }]}
            active={tab}
            onChange={setTab}
          />

          {tab === "services" && (
            <div className="mt-6">
              {categories && categories.length > 0 && (
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  <CategoryPill category={{ id: -1, name: "All" }} active={activeCategory === null} onClick={() => setActiveCategory(null)} />
                  {categories.map((c) => (
                    <CategoryPill key={c.id} category={c} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)} />
                  ))}
                </div>
              )}
              <div className="space-y-3">
                {loadingServices && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                {!loadingServices && services?.length === 0 && <EmptyState icon={Star} title="No services listed yet" description="Check back soon." />}
                {!loadingServices &&
                  services?.map((s) => (
                    <ServiceCard key={s.id} service={s} selected={selected.some((sel) => sel.id === s.id)} onToggle={() => toggleService(s)} />
                  ))}
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="mt-6 space-y-4">
              {authenticated ? (
                <form onSubmit={handleSubmit((values) => submitReview(values))} className="card-surface space-y-3 p-5">
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-200">Leave a review</p>
                  <StarRating value={watch("rating")} onChange={(v) => setValue("rating", v)} />
                  <Textarea placeholder="Share how your visit went…" {...register("reviewText")} error={errors.reviewText?.message} />
                  <Button type="submit" loading={submittingReview} size="sm">Post review</Button>
                </form>
              ) : (
                <p className="text-sm text-ink-500 dark:text-ink-400">Sign in to leave a review.</p>
              )}
              {loadingReviews && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
              {!loadingReviews && reviews?.length === 0 && <EmptyState icon={Star} title="No reviews yet" description="Be the first to share your experience." />}
              {reviews?.map((r) => (
                <ReviewCard key={r.id} review={r} canManage={profile?.id === r.userId} onDelete={() => deleteReview(r.id)} />
              ))}
            </div>
          )}

          {tab === "about" && (
            <div className="mt-6 space-y-3">
              <div className="card-surface space-y-3 p-5 text-sm text-ink-600 dark:text-ink-300">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-moss-500" /> {salon.phoneNumber}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-moss-500" /> {salon.email}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-moss-500" /> {salon.address}, {salon.city}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-moss-500" /> Open {formatTime(salon.openTime)} – {formatTime(salon.closeTime)}</p>
              </div>
            </div>
          )}
        </div>

        <div><BookingPanel salon={salon} selected={selected} /></div>
      </div>
    </div>
  );
}

// Remount the whole page whenever the salon changes, so nothing chosen for one salon
// (services, day, time slot) can carry over into another salon's page.
export default function SalonDetailPage() {
  const { salonId } = useParams();
  return <SalonDetail key={salonId} />;
}
