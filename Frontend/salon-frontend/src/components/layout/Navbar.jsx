import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Moon, Scissors, Sun, User, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button, LinkButton } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/salons", label: "Explore salons" },
  { to: "/bookings", label: "My bookings" },
];

export function Navbar() {
  const { authenticated, profile, logout, isSalonOwner } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryKey: ["notifications", "unread-count", profile?.id],
    queryFn: () => notificationsApi.forUser(profile.id),
    enabled: !!profile?.id,
    refetchInterval: 60_000,
  });
  const unread = notifications?.filter((n) => !n.isRead && (n.type === "BOOKING_CONFIRMED" || n.type === "BOOKING_DECLINED")).length ?? 0;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-cream/85 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/85">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl text-ink-900 dark:text-cream">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss-500 text-cream"><Scissors className="h-4 w-4" /></span>
        Booky
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn("rounded-full px-4 py-2 text-sm font-medium transition-colors", isActive ? "bg-ink-900 text-cream dark:bg-cream dark:text-ink-900" : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800")
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isSalonOwner && (
            <NavLink
              to="/owner"
              className={({ isActive }) =>
                cn("rounded-full px-4 py-2 text-sm font-medium transition-colors", isActive ? "bg-ink-900 text-cream dark:bg-cream dark:text-ink-900" : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800")
              }
            >
              Owner dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {authenticated ? (
            <>
              <LinkButton to="/notifications" variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay-500 text-[10px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </LinkButton>
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar name={profile?.fullName} />
                <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout} aria-label="Sign out"><LogOut className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <LinkButton to="/login" className="hidden sm:inline-flex"><User className="h-4 w-4" />Sign in</LinkButton>
          )}

          <button className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-cream px-4 py-3 dark:border-ink-800 dark:bg-ink-950 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
                {l.label}
              </Link>
            ))}
            {isSalonOwner && (
              <Link to="/owner" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
                Owner dashboard
              </Link>
            )}
            {authenticated ? (
              <button onClick={handleLogout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-clay-600 hover:bg-clay-50 dark:hover:bg-clay-900/30">Sign out</button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-moss-600 hover:bg-moss-50 dark:hover:bg-moss-900/20">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
