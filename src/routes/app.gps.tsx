import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/gps")({ component: GpsPage });

interface Bio { id: string; label: string; addedAt: number }
const KEY = "mit.gps.biometrics.v1";
const MAX = 5;

function GpsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [bios, setBios] = useState<Bio[]>([]);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (auth && auth.role !== "owner") {
      toast.error("Owner-only area.");
      navigate({ to: "/app/travel" });
    }
  }, [auth, navigate]);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setBios(JSON.parse(raw)); } catch { /* noop */ }
  }, []);

  function save(next: Bio[]) { setBios(next); localStorage.setItem(KEY, JSON.stringify(next)); }

  function authenticate() {
    toast.success("Biometric verified.");
    setUnlocked(true);
  }

  function addBio() {
    if (!label.trim()) return toast.error("Give this biometric a label.");
    if (bios.length >= MAX) return toast.error(`Maximum ${MAX} biometric IDs.`);
    save([{ id: crypto.randomUUID(), label: label.trim(), addedAt: Date.now() }, ...bios]);
    setLabel("");
    toast.success("Biometric enrolled.");
  }

  if (auth?.role !== "owner") return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" /> Secure GPS settings
        </h1>
        <p className="text-sm text-muted-foreground">Owner-only. Up to {MAX} biometric IDs.</p>
      </header>

      {!unlocked ? (
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <Fingerprint className="size-12 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Authenticate to continue.</p>
            <Button onClick={authenticate}><Fingerprint className="size-4 mr-2" /> Authenticate</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="text-base">Enroll biometric ID</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Label (e.g. Right thumb)" value={label} onChange={(e) => setLabel(e.target.value)} />
              <Button onClick={addBio} disabled={bios.length >= MAX}>
                <Fingerprint className="size-4 mr-2" /> Enroll ({bios.length}/{MAX})
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Enrolled biometrics</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {bios.length === 0 && <p className="text-sm text-muted-foreground">None enrolled.</p>}
              {bios.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-md border border-border">
                  <div>
                    <div className="text-sm font-medium">{b.label}</div>
                    <div className="text-xs text-muted-foreground">Added {new Date(b.addedAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button size="icon" variant="ghost" onClick={() => save(bios.filter((x) => x.id !== b.id))}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}