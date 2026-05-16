import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { BUSES, COLLEGE, distanceKm, findBus, pointAlongRoute, routeLengthKm, type Bus } from "@/lib/buses";
import { BusMap } from "@/components/BusMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Bell, BellRing, Mic, MicOff, Phone, Search } from "lucide-react";

export const Route = createFileRoute("/app/travel")({
  component: TravelPage,
});

const BUS_SPEED_KMPH = 35;
const TICK_MS = 1000;

function TravelPage() {
  const [query, setQuery] = useState("");
  const [bus, setBus] = useState<Bus | null>(null);
  const [progress, setProgress] = useState(0.05); // 0..1 along route
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [targetStopName, setTargetStopName] = useState<string>(COLLEGE.name);
  const [alertKm, setAlertKm] = useState(1);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const alertedRef = useRef(false);
  const [recording, setRecording] = useState(false);

  const targetStop = useMemo(
    () => bus?.stops.find((s) => s.name === targetStopName) ?? COLLEGE,
    [bus, targetStopName],
  );

  // Get user location once
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setUserPos({ lat: COLLEGE.lat + 0.02, lng: COLLEGE.lng - 0.03 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setUserPos({ lat: COLLEGE.lat + 0.02, lng: COLLEGE.lng - 0.03 }),
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  // Simulated polling: advance bus along route
  useEffect(() => {
    if (!bus) return;
    const total = routeLengthKm(bus.stops);
    const step = (BUS_SPEED_KMPH / 3600) * (TICK_MS / 1000) / total; // fraction per tick
    const id = window.setInterval(() => {
      setProgress((p) => Math.min(1, p + step));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [bus]);

  const busPos = bus ? pointAlongRoute(bus.stops, progress) : null;

  // Distance from bus to selected stop along remaining route (approx: straight-line for simplicity)
  const busToStopKm = busPos ? distanceKm(busPos, targetStop) : 0;
  const etaMin = (busToStopKm / BUS_SPEED_KMPH) * 60;
  const userToStopKm = userPos ? distanceKm(userPos, targetStop) : null;

  // Stop-near notification
  useEffect(() => {
    if (!bus || !alertEnabled || !busPos) return;
    if (busToStopKm <= alertKm && !alertedRef.current) {
      alertedRef.current = true;
      toast.success(`Bus ${bus.routeNo} is ${busToStopKm.toFixed(1)} km from ${targetStop.name}.`, {
        duration: 8000,
      });
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Bus ${bus.routeNo} nearby`, {
          body: `${busToStopKm.toFixed(1)} km from ${targetStop.name}`,
        });
      }
    }
    if (busToStopKm > alertKm * 1.5) alertedRef.current = false;
  }, [busToStopKm, alertKm, alertEnabled, bus, busPos, targetStop]);

  function search() {
    const b = findBus(query);
    if (!b) {
      toast.error("No bus found. Try R1, R2, or R3.");
      return;
    }
    setBus(b);
    setProgress(0.05);
    alertedRef.current = false;
    setTargetStopName(COLLEGE.name);
  }

  function enableBrowserNotifications() {
    if (!("Notification" in window)) return toast.error("Notifications not supported.");
    Notification.requestPermission().then((p) => {
      if (p === "granted") toast.success("Notifications enabled.");
    });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Travel</h1>
        <p className="text-sm text-muted-foreground">Search a bus or route to track in real time.</p>
      </header>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search by bus or route number (e.g. R1, R2, R3)"
            className="pl-9"
          />
        </div>
        <Button onClick={search}>Search</Button>
      </div>

      {!bus ? (
        <div className="grid sm:grid-cols-3 gap-3">
          {BUSES.map((b) => (
            <button
              key={b.id}
              onClick={() => { setQuery(b.routeNo); setBus(b); setProgress(0.05); alertedRef.current = false; }}
              className="text-left p-4 rounded-lg border border-border bg-card hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Bus {b.routeNo}</span>
                <Badge variant="secondary">{b.stops.length} stops</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{b.stops[0].name} → {b.stops[b.stops.length - 1].name}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {busPos && <BusMap bus={bus} busPos={busPos} userPos={userPos} targetStop={targetStop} />}
            <p className="text-xs text-muted-foreground">
              Live position updates every second · OpenStreetMap
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bus {bus.routeNo}</span>
                  <Badge style={{ backgroundColor: "var(--brand-orange)", color: "var(--primary-foreground)" }}>LIVE</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row label="Driver" value={bus.driverName} />
                <Row label="Target stop" value={
                  <Select value={targetStopName} onValueChange={setTargetStopName}>
                    <SelectTrigger className="w-[180px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {bus.stops.map((s) => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                } />
                <Row label="Distance to stop" value={`${busToStopKm.toFixed(2)} km`} />
                <Row label="ETA" value={`${Math.max(0, Math.round(etaMin))} min`} />
                {userToStopKm !== null && <Row label="You → stop" value={`${userToStopKm.toFixed(2)} km`} />}
                <div className="flex gap-2 pt-2">
                  <a href={`tel:${bus.driverPhone.replace(/\s/g, "")}`} className="flex-1">
                    <Button className="w-full" variant="default"><Phone className="size-4 mr-2" /> Call driver</Button>
                  </a>
                  <Button
                    className="flex-1"
                    variant={recording ? "destructive" : "outline"}
                    onClick={() => {
                      setRecording((r) => !r);
                      toast.info(recording ? "Voice message sent to driver (demo)." : "Recording… tap again to send.");
                    }}
                  >
                    {recording ? <MicOff className="size-4 mr-2" /> : <Mic className="size-4 mr-2" />}
                    {recording ? "Stop" : "Voice"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BellRing className="size-4" /> Stop-near alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Alert when within</span>
                  <span className="font-semibold">{alertKm.toFixed(1)} km</span>
                </div>
                <Slider min={0.2} max={5} step={0.1} value={[alertKm]} onValueChange={(v) => { setAlertKm(v[0]); alertedRef.current = false; }} />
                <div className="flex gap-2">
                  <Button size="sm" variant={alertEnabled ? "default" : "outline"} onClick={() => setAlertEnabled((v) => !v)}>
                    <Bell className="size-4 mr-2" /> {alertEnabled ? "Enabled" : "Disabled"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={enableBrowserNotifications}>
                    Browser notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}