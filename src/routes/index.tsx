import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SplashLogo } from "@/components/SplashLogo";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    navigate({ to: auth ? "/app/travel" : "/login" });
  }, [done, auth, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, var(--brand-orange) 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10">
        <SplashLogo />
        <p className="text-center mt-10 text-xs uppercase tracking-[0.4em] text-muted-foreground animate-fade-up" style={{ animationDelay: "1s" }}>
          Campus & Bus Tracker
        </p>
      </div>
    </main>
  );
}
