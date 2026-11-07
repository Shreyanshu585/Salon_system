import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Store } from "lucide-react";
import { toast } from "sonner";
import { salonsApi } from "@/api/salons";
import { useMySalon } from "@/hooks/useMySalon";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FullscreenLoader } from "@/components/ui/FullscreenLoader";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  phoneNumber: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  openTime: z.string().min(1, "Opening time is required"),
  closeTime: z.string().min(1, "Closing time is required"),
  imagesText: z.string().optional(),
});

export default function OwnerSalonPage() {
  const { data: salon, isLoading } = useMySalon();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", address: "", city: "", phoneNumber: "", email: "",
      openTime: "09:00", closeTime: "20:00", imagesText: "",
    },
  });

  useEffect(() => {
    if (salon) {
      reset({
        name: salon.name,
        address: salon.address,
        city: salon.city,
        phoneNumber: salon.phoneNumber,
        email: salon.email,
        openTime: salon.openTime?.slice(0, 5) ?? "09:00",
        closeTime: salon.closeTime?.slice(0, 5) ?? "20:00",
        imagesText: salon.images?.join(", ") ?? "",
      });
    }
  }, [salon, reset]);

  const { mutate: save, isPending } = useMutation({
    mutationFn: (values) => {
      const payload = {
        name: values.name,
        address: values.address,
        city: values.city,
        phoneNumber: values.phoneNumber,
        email: values.email,
        openTime: `${values.openTime}:00`,
        closeTime: `${values.closeTime}:00`,
        images: values.imagesText ? values.imagesText.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      return salon ? salonsApi.update(salon.id, payload) : salonsApi.create(payload);
    },
    onSuccess: () => {
      toast.success(salon ? "Salon updated." : "Salon created — you're live!");
      queryClient.invalidateQueries({ queryKey: ["my-salon"] });
    },
  });

  if (isLoading) return <FullscreenLoader label="Loading your salon…" />;

  return (
    <div>
      <span className="eyebrow">Owner dashboard</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">{salon ? "My salon" : "Set up your salon"}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-500 dark:text-ink-400">This information appears on your public salon page.</p>

      <Card className="mt-6 max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-moss-500" />
            <h2 className="font-display text-lg text-ink-900 dark:text-cream">Salon details</h2>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((v) => save(v))} className="space-y-4">
            <Input label="Salon name" {...register("name")} error={errors.name?.message} />
            <Input label="Address" {...register("address")} error={errors.address?.message} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" {...register("city")} error={errors.city?.message} />
              <Input label="Phone number" {...register("phoneNumber")} error={errors.phoneNumber?.message} />
            </div>
            <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Opens at" type="time" {...register("openTime")} error={errors.openTime?.message} />
              <Input label="Closes at" type="time" {...register("closeTime")} error={errors.closeTime?.message} />
            </div>
            <Textarea label="Image URLs (comma-separated)" placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg" {...register("imagesText")} />
            <Button type="submit" loading={isPending}>{salon ? "Save changes" : "Create salon"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
