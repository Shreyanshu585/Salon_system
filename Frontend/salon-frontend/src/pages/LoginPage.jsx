import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Scissors } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss-500 text-cream"><Scissors className="h-5 w-5" /></span>
          <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Welcome back</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Sign in to book or manage your salon</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="card-surface space-y-4 p-6">
          <Input label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
          <Button type="submit" className="w-full" loading={submitting}>Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          New here? <Link to="/signup" className="font-semibold text-moss-600 hover:underline dark:text-moss-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
