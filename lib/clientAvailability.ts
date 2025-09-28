import type { AvailabilityDay } from "@/lib/availability";

const CACHE_KEY = "pb:client-availability";
const CACHE_TTL = 60 * 1000;

declare global {
  interface Window {
    __availabilityCache?: {
      data: AvailabilityDay[];
      timestamp: number;
      range: { start: string; end: string };
    };
  }
}

export async function prefetchAvailability(range?: { start?: string; end?: string }) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const cached = window.__availabilityCache;
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const today = new Date();
  const start = range?.start ?? today.toISOString().split("T")[0];
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 21);
  const end = range?.end ?? endDate.toISOString().split("T")[0];
  try {
    const response = await fetch(`/api/availability?start=${start}&end=${end}`);
    if (!response.ok) return;
    const payload = await response.json();
    const data: AvailabilityDay[] = payload.data ?? [];
    window.__availabilityCache = { data, timestamp: Date.now(), range: { start, end } };
    return data;
  } catch (error) {
    return;
  }
}
