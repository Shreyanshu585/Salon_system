import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Scissors, Store, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    fullName: z.string().min(2, "Enter your name"),
    username: z.string().min(3, "At least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "SALON_OWNER"]),
  })
  .refine((data) => data.password === data.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "CUSTOMER" },
  });
  const role = watch("role");

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      await signup({ fullName: values.fullName, username: values.username, email: values.email, password: values.password, role: values.role });
      toast.success("Account created!");
      navigate(values.role === "SALON_OWNER" ? "/owner/salon" : "/", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10 dark:bg-ink-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss-500 text-cream"><Scissors className="h-5 w-5" /></span>
          <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Create your account</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Book appointments or list your salon</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="card-surface space-y-4 p-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue("role", "CUSTOMER")}
              className={cn("flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm font-medium transition-colors", role === "CUSTOMER" ? "border-moss-500 bg-moss-500 text-cream" : "border-ink-200 bg-white text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300")}
            >
              <User className="h-4 w-4" />I'm a customer
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "SALON_OWNER")}
              className={cn("flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm font-medium transition-colors", role === "SALON_OWNER" ? "border-moss-500 bg-moss-500 text-cream" : "border-ink-200 bg-white text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300")}
            >
              <Store className="h-4 w-4" />I'm a salon owner
            </button>
          </div>
          <Input label="Full name" {...register("fullName")} error={errors.fullName?.message} />
          <Input label="Username" autoComplete="username" {...register("username")} error={errors.username?.message} />
          <Input label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" autoComplete="new-password" {...register("password")} error={errors.password?.message} />
          <Input label="Confirm password" type="password" autoComplete="new-password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
          <Button type="submit" className="w-full" loading={submitting}>Create account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Already have an account? <Link to="/login" className="font-semibold text-moss-600 hover:underline dark:text-moss-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
