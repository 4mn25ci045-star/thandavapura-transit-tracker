import { useSyncExternalStore } from "react";

export type Role = "student" | "admin" | "teacher" | "owner";
export interface AuthUser {
  id: string;
  name: string;
  usn?: string;
  email?: string;
  role: Role;
  year?: 1 | 2 | 3 | 4;
  branch?: string;
}

const KEY = "mit-thandavapura.auth.v1";
const listeners = new Set<() => void>();
let current: AuthUser | null = load();

function load(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
function persist() {
  if (typeof window === "undefined") return;
  if (current) localStorage.setItem(KEY, JSON.stringify(current));
  else localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export const authStore = {
  get: () => current,
  set: (u: AuthUser | null) => {
    current = u;
    persist();
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useAuth(): AuthUser | null {
  return useSyncExternalStore(
    (cb) => authStore.subscribe(cb),
    () => authStore.get(),
    () => null,
  );
}

export function logout() {
  authStore.set(null);
}

/** Validates USN like "4MN22CS001" (starts with 4MN). */
export function isValidUSN(usn: string) {
  return /^4MN\d{2}[A-Z]{2}\d{3}$/i.test(usn.trim());
}

/** Extract branch + year from a USN like 4MN22CS001. */
export function parseUSN(usn: string): { year: 1 | 2 | 3 | 4; branch: string } | null {
  const m = usn.trim().toUpperCase().match(/^4MN(\d{2})([A-Z]{2})\d{3}$/);
  if (!m) return null;
  const yearDigits = parseInt(m[1], 10);
  const now = new Date().getFullYear() % 100;
  let y = now - yearDigits + 1;
  if (y < 1) y = 1;
  if (y > 4) y = 4;
  return { year: y as 1 | 2 | 3 | 4, branch: m[2] };
}