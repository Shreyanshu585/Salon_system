import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Scissors } from "lucide-react";
import { toast } from "sonner";
import { servicesApi } from "@/api/services";
import { categoriesApi } from "@/api/categories";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { RequireSalon } from "./RequireSalon";
import { formatCurrency, minutesToLabel } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(3, "Description is required"),
  price: z.coerce.number().positive("Enter a valid price"),
  duration: z.coerce.number().positive("Enter duration in minutes"),
  category: z.coerce.number().min(1, "Choose a category"),
  image: z.string().optional(),
});

function ServicesForSalon({ salon }) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ["categories", "salon", salon.id],
    queryFn: () => categoriesApi.bySalon(salon.id),
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", "salon", salon.id, "all"],
    queryFn: () => servicesApi.bySalon(salon.id),
  });

  const categoryMap = useMemo(() => new Map((categories ?? []).map((c) => [c.id, c.name])), [categories]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  function openCreate() {
    setEditing(null);
    reset({ name: "", description: "", price: 0, duration: 30, category: categories?.[0]?.id ?? 0, image: "" });
    setDialogOpen(true);
  }

  function openEdit(service) {
    setEditing(service);
    reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.categoryId,
      image: service.image ?? "",
    });
    setDialogOpen(true);
  }

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: (values) => {
      if (editing) {
        return servicesApi.update(editing.id, {
          id: editing.id,
          name: values.name,
          description: values.description,
          price: values.price,
          duration: values.duration,
          salonId: salon.id,
          categoryId: values.category,
          image: values.image,
        });
      }
      return servicesApi.create({
        name: values.name,
        description: values.description,
        price: values.price,
        duration: values.duration,
        category: values.category,
        image: values.image,
      });
    },
    onSuccess: () => {
      toast.success(editing ? "Service updated." : "Service added.");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["services", "salon", salon.id] });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500 dark:text-ink-400">Manage what customers can book.</p>
        <Button size="sm" onClick={openCreate} disabled={!categories || categories.length === 0}>
          <Plus className="h-4 w-4" /> Add service
        </Button>
      </div>
      {(!categories || categories.length === 0) && (
        <p className="mt-2 text-xs text-gold-600 dark:text-gold-300">Add a category first — services need one to belong to.</p>
      )}

      <div className="mt-5 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        {!isLoading && services?.length === 0 && (
          <EmptyState icon={Scissors} title="No services yet" description="Add your first service to start taking bookings." />
        )}
        {services?.map((s) => (
          <Card key={s.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-3">
              {s.image ? (
                <img
                  src={s.image}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-xs text-ink-400 dark:bg-ink-800">
                  No image
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink-800 dark:text-ink-100">{s.name}</p>
                  <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                    {categoryMap.get(s.categoryId) ?? "Uncategorized"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-500 dark:text-ink-400">{s.description}</p>
                <p className="mt-1 text-xs text-ink-400">{formatCurrency(s.price)} · {minutesToLabel(s.duration)}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? "Edit service" : "New service"}>
        <form onSubmit={handleSubmit((v) => save(v))} className="space-y-4">
          <Input label="Service name" {...register("name")} error={errors.name?.message} />
          <Textarea label="Description" {...register("description")} error={errors.description?.message} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Price (₹)" type="number" {...register("price")} error={errors.price?.message} />
            <Input label="Duration (min)" type="number" {...register("duration")} error={errors.duration?.message} />
          </div>
          <Select label="Category" {...register("category")} error={errors.category?.message}>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Input label="Image URL (optional)" {...register("image")} />
          <Button type="submit" loading={saving} className="w-full">{editing ? "Save changes" : "Add service"}</Button>
        </form>
      </Dialog>
    </div>
  );
}

export default function OwnerServicesPage() {
  return (
    <div>
      <span className="eyebrow">Owner dashboard</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">Services</h1>
      <div className="mt-6">
        <RequireSalon>{(salon) => <ServicesForSalon salon={salon} />}</RequireSalon>
      </div>
    </div>
  );
}
