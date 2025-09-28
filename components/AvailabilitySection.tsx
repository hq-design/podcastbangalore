"use client";

import useSWR from "swr";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatISO,
  isBefore,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { AvailabilityDay, AvailabilitySlot, AvailabilityStatus } from "@/lib/availability";
import { useBooking } from "@/components/BookingContext";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface AvailabilityResponse {
  data: AvailabilityDay[];
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error("Failed to load availability");
  }
  return res.json() as Promise<AvailabilityResponse>;
});

const statusStyles: Record<AvailabilityStatus, string> = {
  available: "bg-emerald-400",
  limited: "bg-amber-400",
  booked: "bg-red-500",
};

function AvailabilitySection() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { open } = useBooking();

  const startDateIso = formatISO(startOfMonth(currentMonth), { representation: "date" });
  const endDateIso = formatISO(addDays(endOfMonth(currentMonth), 20), { representation: "date" });

  const { data, error, isLoading, mutate } = useSWR<AvailabilityResponse>(
    `/api/availability?start=${startDateIso}&end=${endDateIso}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  );

  useEffect(() => {
    if (!data) return;
    if (selectedDate && data.data.some((day) => isSameDay(parseISO(day.date), selectedDate))) {
      return;
    }
    const firstAvailable = data.data.find((day) => day.slots.some((slot) => slot.status !== "booked"));
    if (firstAvailable) {
      setSelectedDate(parseISO(firstAvailable.date));
    } else if (data.data[0]) {
      setSelectedDate(parseISO(data.data[0].date));
    }
  }, [data, selectedDate]);

  const availabilityMap = useMemo(() => {
    if (!data) return new Map<string, AvailabilityDay>();
    return new Map(data.data.map((day) => [day.date, day] as const));
  }, [data]);

  const daysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedDayKey = selectedDate ? formatISO(selectedDate, { representation: "date" }) : null;
  const selectedDay = selectedDayKey ? availabilityMap.get(selectedDayKey) : undefined;

  const slots = selectedDay?.slots ?? [];

  return (
    <section id="availability" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10 flex flex-col gap-4 text-white lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="text-sm uppercase tracking-widest text-primary">Live availability</span>
          <h2 className="font-display text-4xl leading-tight">Reserve your studio slot in seconds.</h2>
          <p className="max-w-2xl text-lg text-white/70">
            Pick a preferred day to reveal open sessions, then launch the booking flow or hand-off to concierge support instantly.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/60">
          <AvailabilityBadge updatedAt={data?.updatedAt} isLoading={isLoading} hasError={Boolean(error)} onRefresh={() => mutate()} />
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <header className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white"
              onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center text-lg font-semibold text-white">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button
              type="button"
              className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white"
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </header>

          <div className="grid grid-cols-7 text-center text-xs uppercase tracking-widest text-white/40">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-sm">
            {daysInMonth.map((day) => {
              const key = formatISO(day, { representation: "date" });
              const availability = availabilityMap.get(key);
              const dayStatus = resolveStatus(availability?.slots ?? []);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isDisabled = !availability;

              return (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition",
                    isCurrentMonth ? "border-white/10" : "border-transparent text-white/20",
                    selectedDate && isSameDay(day, selectedDate) && "border-primary/70 bg-primary/10 text-white",
                    isDisabled && "opacity-40"
                  )}
                  disabled={isDisabled}
                  onClick={() => setSelectedDate(day)}
                  aria-pressed={selectedDate ? isSameDay(day, selectedDate) : false}
                >
                  <span className="text-base font-semibold text-white/80">
                    {format(day, "d")}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    {isToday(day) ? "Today" : format(day, "EEE")}
                  </span>
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      dayStatus ? statusStyles[dayStatus] : "bg-white/10"
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-3 text-sm uppercase tracking-widest text-white/60">
              <Clock3 className="h-4 w-4 text-primary" /> Available slots
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {isLoading && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                  Loading availability…
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                  Availability feed is warming up. Try again shortly.
                </div>
              )}
              {!isLoading && !error && slots.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                  No slots published for this date yet. Tap contact to coordinate directly.
                </div>
              )}
              {slots.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  className={cn(
                    "flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition",
                    slot.status === "available"
                      ? "border-accent-green/50 bg-accent-green/10 text-white"
                      : slot.status === "limited"
                      ? "border-amber-400/50 bg-amber-400/10 text-white"
                      : "border-white/10 bg-white/5 text-white/60"
                  )}
                  disabled={slot.status === "booked"}
                  onClick={() => {
                    setSelectedDate(parseISO(slot.start));
                    open(
                      {
                        date: selectedDayKey ?? formatISO(new Date(), { representation: "date" }),
                        start: slot.start,
                        end: slot.end,
                      },
                      "availability"
                    );
                    trackEvent(ANALYTICS_EVENTS.BOOKING_OPENED, {
                      source: "availability",
                      slotStart: slot.start,
                      slotEnd: slot.end,
                    });
                  }}
                >
                  <span className="text-sm font-semibold text-white">
                    {format(parseISO(slot.start), "hh:mm a")} – {format(parseISO(slot.end), "hh:mm a")}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-white/60">
                    {slot.status === "available"
                      ? "Open"
                      : slot.status === "limited"
                      ? "Limited — confirm asap"
                      : "Booked"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <QuoteCalculator />
      </div>
    </section>
  );
}

export { AvailabilitySection };
export default AvailabilitySection;

function resolveStatus(slots: AvailabilitySlot[]): AvailabilityStatus {
  if (!slots.length) return "booked";
  if (slots.every((slot) => slot.status === "booked")) return "booked";
  if (slots.some((slot) => slot.status === "limited" || slot.status === "booked")) return "limited";
  return "available";
}

interface AvailabilityBadgeProps {
  updatedAt?: string;
  isLoading: boolean;
  hasError: boolean;
  onRefresh: () => void;
}

function AvailabilityBadge({ updatedAt, isLoading, hasError, onRefresh }: AvailabilityBadgeProps) {
  const formatted = updatedAt ? format(parseISO(updatedAt), "MMM d, h:mm a") : null;
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/60">
      <CalendarDays className="h-4 w-4 text-primary" />
      <span className={cn("inline-flex h-2 w-2 rounded-full", hasError ? "bg-red-500" : isLoading ? "bg-amber-400" : "bg-accent-green")}></span>
      <span>{hasError ? "Offline" : isLoading ? "Refreshing" : "Live"}</span>
      {formatted && <span className="text-white/40">Updated {formatted}</span>}
      <button
        className="rounded-full border border-white/10 px-3 py-1 text-white/60 hover:text-white"
        onClick={onRefresh}
      >
        Refresh
      </button>
    </div>
  );
}
