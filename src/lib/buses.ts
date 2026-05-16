export interface BusStop {
  name: string;
  lat: number;
  lng: number;
}
export interface Bus {
  id: string;
  routeNo: string;
  driverName: string;
  driverPhone: string;
  stops: BusStop[];
}

// MIT Thandavapura is south of Mysuru. Coords are illustrative.
export const COLLEGE: BusStop = { name: "MIT Thandavapura", lat: 12.1486, lng: 76.6815 };

export const BUSES: Bus[] = [
  {
    id: "bus-1",
    routeNo: "R1",
    driverName: "Rajesh K",
    driverPhone: "+91 90000 00001",
    stops: [
      { name: "Mysuru City Bus Stand", lat: 12.3072, lng: 76.6497 },
      { name: "Chamundipuram", lat: 12.2958, lng: 76.6602 },
      { name: "Nanjangud Road Jn", lat: 12.2461, lng: 76.6745 },
      { name: "Thandavapura Village", lat: 12.1610, lng: 76.6790 },
      COLLEGE,
    ],
  },
  {
    id: "bus-2",
    routeNo: "R2",
    driverName: "Suresh M",
    driverPhone: "+91 90000 00002",
    stops: [
      { name: "Nanjangud Town", lat: 12.1180, lng: 76.6836 },
      { name: "Hadinaru", lat: 12.1380, lng: 76.6798 },
      { name: "Thandavapura Cross", lat: 12.1520, lng: 76.6800 },
      COLLEGE,
    ],
  },
  {
    id: "bus-3",
    routeNo: "R3",
    driverName: "Anil P",
    driverPhone: "+91 90000 00003",
    stops: [
      { name: "Bannur", lat: 12.3215, lng: 76.8260 },
      { name: "T. Narsipur", lat: 12.2120, lng: 76.9000 },
      { name: "Talakad Jn", lat: 12.1800, lng: 76.8000 },
      { name: "Thandavapura East", lat: 12.1540, lng: 76.7100 },
      COLLEGE,
    ],
  },
];

export function findBus(query: string): Bus | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return BUSES.find(
    (b) => b.routeNo.toLowerCase() === q || b.id.toLowerCase() === q || b.routeNo.toLowerCase().includes(q),
  );
}

/** Haversine distance in km. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(la1) * Math.cos(la2);
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Total polyline length. */
export function routeLengthKm(stops: BusStop[]) {
  let d = 0;
  for (let i = 1; i < stops.length; i++) d += distanceKm(stops[i - 1], stops[i]);
  return d;
}

/**
 * Returns a point along the polyline given progress 0..1.
 */
export function pointAlongRoute(stops: BusStop[], progress: number): { lat: number; lng: number } {
  const total = routeLengthKm(stops);
  const target = Math.max(0, Math.min(1, progress)) * total;
  let walked = 0;
  for (let i = 1; i < stops.length; i++) {
    const seg = distanceKm(stops[i - 1], stops[i]);
    if (walked + seg >= target) {
      const t = seg === 0 ? 0 : (target - walked) / seg;
      return {
        lat: stops[i - 1].lat + (stops[i].lat - stops[i - 1].lat) * t,
        lng: stops[i - 1].lng + (stops[i].lng - stops[i - 1].lng) * t,
      };
    }
    walked += seg;
  }
  return { lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng };
}