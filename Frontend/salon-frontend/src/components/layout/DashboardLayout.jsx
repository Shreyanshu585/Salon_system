import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Bell, Scissors, ShoppingBag, Store, Tags } from "lucide-react";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

const links = [
  { to: "/owner", label: "Overview", icon: BarChart3, end: true },
  { to: "/owner/salon", label: "My salon", icon: Store },
  { to: "/owner/categories", label: "Categories", icon: Tags },
  { to: "/owner/services", label: "Services", icon: Scissors },
  { to: "/owner/bookings", label: "Bookings", icon: ShoppingBag },
  { to: "/owner/notifications", label: "Notifications", icon: Bell },
];

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container-page border-b border-ink-100 py-3 dark:border-ink-800 md:hidden">
        <nav className="flex gap-2 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => cn("flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium", isActive ? "bg-moss-500 text-cream" : "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300")}
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="container-page flex flex-1 gap-8 py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => cn("flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-moss-500 text-cream shadow-soft" : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800")}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 pb-16"><Outlet /></div>
      </div>
    </div>
  );
}
