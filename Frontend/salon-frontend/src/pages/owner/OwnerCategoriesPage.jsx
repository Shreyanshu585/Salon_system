import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { categoriesApi } from "@/api/categories";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { RequireSalon } from "./RequireSalon";

const schema = z.object({
  name: z.string().min(2, "Category name is required"),
  image: z.string().optional(),
});

function CategoriesForSalon({ salon }) {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", "salon", salon.id],
    queryFn: () => categoriesApi.bySalon(salon.id),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: (values) => categoriesApi.create(values),
    onSuccess: () => {
      toast.success("Category added.");
      reset();
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories", "salon", salon.id] });
    },
  });

  const { mutate: remove, isPending: removing } = useMutation({
    mutationFn: (id) => categoriesApi.remove(id),
    onSuccess: () => {
      toast.success("Category removed.");
      setToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["categories", "salon", salon.id] });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500 dark:text-ink-400">Group your services so customers can browse faster.</p>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add category</Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        {!isLoading && categories?.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState icon={Tags} title="No categories yet" description="Add your first category to get started." />
          </div>
        )}
        {categories?.map((c) => (
          <Card key={c.id} className="flex items-center justify-between p-4">
            <span className="font-medium text-ink-800 dark:text-ink-100">{c.name}</span>
            <button
              onClick={() => setToDelete(c.id)}
              className="rounded-full p-1.5 text-ink-400 hover:bg-clay-50 hover:text-clay-600 dark:hover:bg-clay-900/30"
              aria-label={`Delete ${c.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="New category">
        <form onSubmit={handleSubmit((v) => create(v))} className="space-y-4">
          <Input label="Category name" placeholder="e.g. Hair, Skin, Nails" {...register("name")} error={errors.name?.message} />
          <Input label="Image URL (optional)" {...register("image")} />
          <Button type="submit" loading={creating} className="w-full">Add category</Button>
        </form>
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete !== null && remove(toDelete)}
        title="Delete this category?"
        description="Services under this category won't be deleted, but they'll lose their grouping."
        confirmLabel="Delete"
        destructive
        loading={removing}
      />
    </div>
  );
}

export default function OwnerCategoriesPage() {
  return (
    <div>
      <span className="eyebrow">Owner dashboard</span>
      <h1 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">Categories</h1>
      <div className="mt-6">
        <RequireSalon>{(salon) => <CategoriesForSalon salon={salon} />}</RequireSalon>
      </div>
    </div>
  );
}
