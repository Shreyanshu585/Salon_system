import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { salonsApi } from "@/api/salons";
import { SalonCard } from "@/components/feature/SalonCard";
import { SalonCardSkeleton } from "@/components/ui/Skeleton";
import { LinkButton } from "@/components/ui/Button";
import { motion } from "framer-motion";

const steps = [
  { icon: MapPinned, title: "Find your salon", body: "Browse trusted salons and spas near you, filtered by city and specialty." },
  { icon: CalendarCheck, title: "Pick a slot", body: "See real-time open slots and choose exactly what you want done." },
  { icon: ShieldCheck, title: "Pay securely", body: "Confirm with Razorpay or card — your booking locks in instantly." },
];

export default function HomePage() {
  const { data: salons, isLoading } = useQuery({ queryKey: ["salons", "featured"], queryFn: salonsApi.list });

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="grain absolute inset-0" />
        <div className="container-page relative grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Appointment booking, reimagined</span>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink-900 dark:text-cream sm:text-5xl lg:text-6xl">
              Your next great <em className="text-moss-600 not-italic dark:text-moss-300">haircut</em> is three taps away
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink-500 dark:text-ink-400">
              Shreyanshu connects you with vetted salons and spas — real-time availability, transparent pricing, and a ticket in your pocket the moment you confirm.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/salons" size="lg">Explore salons <ArrowRight className="h-4 w-4" /></LinkButton>
              <LinkButton to="/bookings" variant="outline" size="lg">My bookings</LinkButton>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -3 }} transition={{ duration: 0.7, delay: 0.15 }} className="mx-auto w-full max-w-sm">
            <div className="ticket -rotate-2">
              <div className="flex flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="eyebrow flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> Confirmed</span>
                  <span className="rounded-full bg-moss-100 px-2.5 py-1 text-xs font-semibold text-moss-700 dark:bg-moss-900/40 dark:text-moss-200">#A192</span>
                </div>
                <h3 className="font-display text-2xl text-ink-900 dark:text-cream">Glow &amp; Co. Studio</h3>
                <p className="text-sm text-ink-500 dark:text-ink-400">Balayage + Hair Spa · 90 min</p>
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-ink-100 pt-3 dark:border-ink-800">
                  <div>
                    <p className="text-xs text-ink-400">Today</p>
                    <p className="font-display text-lg text-ink-900 dark:text-cream">4:30 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-400">Total</p>
                    <p className="font-display text-lg text-moss-600 dark:text-moss-300">₹2,400</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-white/60 py-16 dark:border-ink-800 dark:bg-ink-900/30">
        <div className="container-page">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">Three steps to your seat</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-moss-500/10 text-moss-600 dark:text-moss-300"><step.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-display text-xl text-ink-900 dark:text-cream">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{step.body}</p>
                <span className="absolute -top-2 right-0 font-display text-5xl text-ink-100 dark:text-ink-800">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Handpicked for you</span>
            <h2 className="mt-2 font-display text-3xl text-ink-900 dark:text-cream">Popular right now</h2>
          </div>
          <Link to="/salons" className="hidden items-center gap-1 text-sm font-semibold text-moss-600 hover:underline dark:text-moss-300 sm:flex">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <SalonCardSkeleton key={i} />)}
          {!isLoading && salons?.slice(0, 6).map((salon) => <SalonCard key={salon.id} salon={salon} />)}
        </div>
      </section>
    </div>
  );
}
