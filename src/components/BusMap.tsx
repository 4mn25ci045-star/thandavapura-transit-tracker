import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Bus, BusStop } from "@/lib/buses";

interface Props {
  bus: Bus;
  busPos: { lat: number; lng: number };
  userPos: { lat: number; lng: number } | null;
  targetStop: BusStop;
}

export function BusMap({ bus, busPos, userPos, targetStop }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const routeLatLngs = useMemo(
    () => bus.stops.map((s) => [s.lat, s.lng] as [number, number]),
    [bus],
  );

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { zoomControl: true }).setView([busPos.lat, busPos.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route + stops
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layers: L.Layer[] = [];
    const poly = L.polyline(routeLatLngs, { color: "#f59e0b", weight: 4, opacity: 0.85 }).addTo(map);
    layers.push(poly);
    bus.stops.forEach((s, i) => {
      const isTarget = s.name === targetStop.name;
      const m = L.circleMarker([s.lat, s.lng], {
        radius: isTarget ? 8 : 5,
        color: isTarget ? "#f59e0b" : "#cbd5e1",
        weight: 2,
        fillColor: isTarget ? "#f59e0b" : "#1f2937",
        fillOpacity: 1,
      })
        .bindTooltip(`${i + 1}. ${s.name}`, { direction: "top" })
        .addTo(map);
      layers.push(m);
    });
    map.fitBounds(poly.getBounds(), { padding: [40, 40] });
    return () => {
      layers.forEach((l) => map.removeLayer(l));
    };
  }, [bus, routeLatLngs, targetStop]);

  // Bus marker (animated icon)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:22px;height:22px;border-radius:9999px;background:#f59e0b;border:3px solid white;box-shadow:0 0 0 4px rgba(245,158,11,.35);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    if (!busMarkerRef.current) {
      busMarkerRef.current = L.marker([busPos.lat, busPos.lng], { icon }).addTo(map);
      busMarkerRef.current.bindTooltip(`Bus ${bus.routeNo}`, { permanent: false });
    } else {
      busMarkerRef.current.setLatLng([busPos.lat, busPos.lng]);
    }
  }, [bus, busPos]);

  // User marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userPos) return;
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;border-radius:9999px;background:#3b82f6;border:3px solid white;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userPos.lat, userPos.lng], { icon }).addTo(map).bindTooltip("You");
    } else {
      userMarkerRef.current.setLatLng([userPos.lat, userPos.lng]);
    }
  }, [userPos]);

  return <div ref={ref} className="h-[420px] w-full rounded-lg overflow-hidden border border-border" />;
}