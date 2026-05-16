import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { logout, useAuth } from "@/lib/auth-store";
import { SplashLogo } from "@/components/SplashLogo";
import { Button } from "@/components/ui/button";
import {
  Bus,
  Megaphone,
  CalendarDays,
  Clock,
  AlertTriangle,
  GraduationCap,
  Fingerprint,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const TABS = [
  { to: "/app/travel", label: "Travel", icon: Bus },
  { to: "/app/updates", label: "College Updates", icon: Megaphone },
  { to: "/app/calendars", label: "Calendars", icon: CalendarDays },
  { to: "/app/timetable", label: "Time Table", icon: Clock },
  { to: "/app/issues", label: "Issues", icon: AlertTriangle },
  { to: "/app/exams", label: "Exam Time Table", icon: GraduationCap },
] as const;

function AppLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!auth) navigate({ to: "/login" });
  }, [auth, navigate]);

  if (!auth) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/app/travel" className="flex items-center gap-3">
            <SplashLogo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium leading-tight">{auth.name}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {auth.role}{auth.usn ? ` · ${auth.usn}` : ""}
              </span>
            </div>
            {auth.role === "owner" && (
              <Link to="/app/gps">
                <Button variant="outline" size="sm">
                  <Fingerprint className="size-4 mr-2" /> GPS
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate({ to: "/login" }); }}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-2 overflow-x-auto">
          <ul className="flex gap-1 pb-2">
            {TABS.map(({ to, label, icon: Icon }) => {
              const active = path.startsWith(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}