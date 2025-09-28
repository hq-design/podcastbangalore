import { addDays, formatISO, parseISO } from "date-fns";

export type AvailabilityStatus = "available" | "limited" | "booked";

export interface AvailabilitySlot {
  start: string;
  end: string;
  status: AvailabilityStatus;
}

export interface AvailabilityDay {
  date: string;
  slots: AvailabilitySlot[];
}

interface AvailabilityOptions {
  start?: string;
  end?: string;
}

const CACHE_TTL = 30 * 1000;
const cache = new Map<string, { expiry: number; data: AvailabilityDay[] }>();

export async function fetchAvailability(options: AvailabilityOptions = {}): Promise<AvailabilityDay[]> {
  const startDate = options.start ? parseISO(options.start) : new Date();
  const endDate = options.end ? parseISO(options.end) : addDays(startDate, 14);
  const cacheKey = `${formatISO(startDate, { representation: "date" })}-${formatISO(endDate, { representation: "date" })}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const provider = process.env.BOOKING_PROVIDER ?? "none";
  let data: AvailabilityDay[];

  try {
    if (provider === "cal") {
      data = await fetchCalAvailability(startDate, endDate);
    } else if (provider === "ics") {
      data = await fetchIcsAvailability(startDate, endDate);
    } else {
      data = generateMockAvailability(startDate, endDate);
    }
  } catch (error) {
    console.error("Availability fetch failed, falling back to mock data", error);
    data = generateMockAvailability(startDate, endDate);
  }

  cache.set(cacheKey, { data, expiry: now + CACHE_TTL });
  return data;
}

async function fetchCalAvailability(start: Date, end: Date): Promise<AvailabilityDay[]> {
  const apiKey = process.env.CAL_API_KEY;
  const username = process.env.CAL_USERNAME;
  if (!apiKey || !username) {
    console.warn("Cal.com credentials missing, serving mock availability");
    return generateMockAvailability(start, end);
  }

  const url = new URL(`https://api.cal.com/v1/availability/${username}`);
  url.searchParams.set("start", start.toISOString());
  url.searchParams.set("end", end.toISOString());

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`Cal.com API response ${response.status}`);
  }

  const payload = (await response.json()) as {
    days: Array<{ date: string; isAvailable: boolean; slots: Array<{ start: string; end: string }> }>;
  };

  return payload.days.map((day) => ({
    date: day.date,
    slots: day.slots.map((slot) => ({
      start: slot.start,
      end: slot.end,
      status: day.isAvailable ? "available" : "booked",
    })),
  }));
}

async function fetchIcsAvailability(start: Date, end: Date): Promise<AvailabilityDay[]> {
  const icsUrl = process.env.ICS_FEED_URL;
  if (!icsUrl) {
    console.warn("ICS feed missing, serving mock availability");
    return generateMockAvailability(start, end);
  }

  const response = await fetch(icsUrl, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`ICS fetch failed ${response.status}`);
  }

  // Parsing ICS is out-of-scope for this placeholder and would require an additional dependency.
  console.warn("ICS parsing not implemented yet, serving mock availability");
  return generateMockAvailability(start, end);
}

function generateMockAvailability(start: Date, end: Date): AvailabilityDay[] {
  const dayMs = 1000 * 60 * 60 * 24;
  const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / dayMs) + 1);
  return Array.from({ length: diffDays }, (_, index) => {
    const date = addDays(start, index);
    const isoDate = formatISO(date, { representation: "date" });
    const slots: AvailabilitySlot[] = [0, 1, 2].map((slotIndex) => {
      const slotStart = new Date(date);
      slotStart.setHours(10 + slotIndex * 3, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 2);
      const status: AvailabilityStatus = slotIndex === 2 ? "limited" : slotIndex === 1 && index % 3 === 0 ? "booked" : "available";
      return {
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        status,
      };
    });
    return { date: isoDate, slots };
  });
}
