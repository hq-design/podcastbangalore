"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatISO,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, ChevronLeft, ChevronRight, Check, Loader2, Phone } from "lucide-react";

import { useBooking } from "@/components/BookingContext";
import type { AvailabilityDay, AvailabilitySlot } from "@/lib/availability";
import { bookingLayouts } from "@/lib/data";
import { cn } from "@/lib/utils";

const bookingUrl = process.env.NEXT_PUBLIC_CAL_URL ?? "https://cal.com/your-studio/60";

interface FormState {
  name: string;
  email: string;
  phone: string;
}

const steps = ["When", "Format", "Details"] as const;

type Step = 0 | 1 | 2;

declare global {
  interface Window {
    __availabilityCache?: {
      data: AvailabilityDay[];
      timestamp: number;
      range: { start: string; end: string };
    };
  }
}

export function BookingModal() {
  const {
    isOpen,
    close,
    selectedSlot,
    setSelectedSlot,
    selectedLayout,
    setSelectedLayout,
    setQuoteSummary,
    guestDetails,
    setGuestDetails,
  } = useBooking();

  const [step, setStep] = useState<Step>(0);
  const [showScheduler, setShowScheduler] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [availability, setAvailability] = useState<Map<string, AvailabilityDay>>(new Map());
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "" });
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const timeZone = useMemo(() => {
    if (typeof window === "undefined") return "Asia/Kolkata";
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setShowScheduler(false);
    setIsLoaded(false);
    setCurrentMonth(startOfMonth(new Date()));
    setSelectedLayout(null);
    setGuestDetails(null);
    setForm({ name: "", email: "", phone: "" });

    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("pb:last-session");
        if (stored) {
          const parsed = JSON.parse(stored) as { layout?: string | null };
          if (parsed.layout) {
            setSelectedLayout(parsed.layout);
          }
        }
      } catch (error) {
        /* ignore */
      }
    }
  }, [isOpen, setGuestDetails, setSelectedLayout]);

  useEffect(() => {
    if (!isOpen) return;
    loadAvailability(currentMonth).catch(() => {
      /* handled in loader */
    });
  }, [currentMonth, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (selectedSlot?.start) {
      const key = formatISO(parseISO(selectedSlot.start), { representation: "date" });
      setSelectedDateKey(key);
    }
  }, [selectedSlot, isOpen]);

  const availabilityList = useMemo(() => Array.from(availability.values()).sort((a, b) => (a.date < b.date ? -1 : 1)), [availability]);

  const selectedDay = selectedDateKey ? availability.get(selectedDateKey) ?? null : null;

  const slotsForSelectedDay = selectedDay?.slots ?? [];
  const slotForContext = selectedSlot?.start ? slotsForSelectedDay.find((slot) => slot.start === selectedSlot.start) ?? null : null;

  const canProceedStepOne = Boolean(selectedSlot && selectedSlot.start && selectedSlot.end);
  const canProceedStepTwo = Boolean(selectedLayout);
  const isFormValid = Boolean(form.name && form.email);

  const progressValue = showScheduler ? steps.length : step + 1;

  const handleClose = () => {
    close();
    setIsLoaded(false);
  };

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot({ date: formatISO(parseISO(slot.start), { representation: "date" }), start: slot.start, end: slot.end });
  };

  const handleLayoutSelect = (layoutId: string) => {
    setSelectedLayout(layoutId);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSlot?.start || !selectedLayout || !isFormValid) return;

    const layout = bookingLayouts.find((layout) => layout.id === selectedLayout);
    const startTime = format(parseISO(selectedSlot.start), "MMM d, h:mm a");
    const summary = [
      `Date ${startTime}`,
      layout ? `Format ${layout.title}` : null,
      form.name ? `Guest ${form.name}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    setQuoteSummary(summary);
    setGuestDetails({ ...form });
    setShowScheduler(true);
  };

  const handleBack = () => {
    if (step === 0) {
      handleClose();
    } else {
      setStep((prev) => {
        const next = (prev - 1) as number;
        return next < 0 ? 0 : (next as Step);
      });
    }
  };

  const handleNext = () => {
    if (step === 0 && !canProceedStepOne) return;
    if (step === 1 && !canProceedStepTwo) return;
    setStep((prev) => {
      const next = Math.min(prev + 1, steps.length - 1) as number;
      return next as Step;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[40px] border border-border bg-background"
            initial={{ y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex flex-col gap-4 border-b border-border px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-text-primary">Reserve your session</h3>
                  <p className="text-sm text-text-muted">Timezone detected: {timeZone}</p>
                </div>
                <button
                  className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.4em] text-text-muted hover:text-text-primary"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
              <ProgressIndicator steps={steps} current={progressValue} total={steps.length} />
            </header>

            <div className="flex-1 overflow-hidden">
              {!showScheduler ? (
                <div className="h-full overflow-y-auto px-8 py-8">
                  {step === 0 && (
                    <StepCalendar
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                      availability={availabilityList}
                      selectedDateKey={selectedDateKey}
                      onSelectDate={setSelectedDateKey}
                      selectedSlot={slotForContext}
                      onSelectSlot={handleSlotSelect}
                      loading={isLoadingAvailability}
                    />
                  )}
                  {step === 1 && (
                    <StepLayout selectedLayout={selectedLayout} onSelect={handleLayoutSelect} />
                  )}
                  {step === 2 && (
                    <StepDetails
                      form={form}
                      onChange={setForm}
                      onSubmit={handleFormSubmit}
                      canSubmit={isFormValid}
                      detectingMotion={prefersReducedMotion}
                    />
                  )}
                </div>
              ) : (
                <div className="relative h-full bg-background">
                  {!isLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-sm text-text-muted">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      Opening booking portal…
                    </div>
                  )}
                  <iframe
                    key={bookingUrl}
                    src={withPrefill(bookingUrl, { slot: selectedSlot, layout: selectedLayout, guest: form })}
                    className={cn("h-full w-full", !isLoaded && "opacity-0")}
                    onLoad={() => setIsLoaded(true)}
                    title="Booking"
                    allow="camera; microphone; clipboard-write"
                  />
                </div>
              )}
            </div>

            {!showScheduler && (
              <footer className="flex items-center justify-between border-t border-border bg-surface/70 px-8 py-5 text-xs uppercase tracking-[0.35em] text-text-muted">
                <span>
                  {step === 0 && (canProceedStepOne ? "Slot selected" : "Select a slot to continue")}
                  {step === 1 && (canProceedStepTwo ? "Format selected" : "Choose the session format")}
                  {step === 2 && (isFormValid ? "Ready to open scheduler" : "Fill in your details")}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-full border border-border px-5 py-2 text-text-muted transition hover:text-text-primary"
                  >
                    {step === 0 ? "Cancel" : "Back"}
                  </button>
                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={(step === 0 && !canProceedStepOne) || (step === 1 && !canProceedStepTwo)}
                      className={cn(
                        "rounded-full border border-primary bg-primary px-6 py-2 text-text-primary transition hover:bg-primary/80",
                        ((step === 0 && !canProceedStepOne) || (step === 1 && !canProceedStepTwo)) && "opacity-50"
                      )}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      form="booking-details-form"
                      disabled={!isFormValid}
                      className={cn(
                        "rounded-full border border-primary bg-primary px-6 py-2 text-text-primary transition hover:bg-primary/80",
                        !isFormValid && "opacity-50"
                      )}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </footer>
            )}

            {showScheduler && (
              <footer className="flex items-center justify-between border-t border-border bg-surface/70 px-8 py-5 text-sm text-text-muted">
                <div>
                  Prefer concierge? Call
                  <a className="ml-2 text-text-primary hover:text-primary" href="tel:+919900112233">
                    +91 9900 112233
                  </a>
                </div>
                <div>
                  Portal not loading? Email
                  <a className="ml-2 text-text-primary hover:text-primary" href="mailto:concierge@podcastbangalore.com">
                    concierge@podcastbangalore.com
                  </a>
                </div>
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  async function loadAvailability(month: Date) {
    setIsLoadingAvailability(true);
    try {
      const start = formatISO(startOfMonth(month), { representation: "date" });
      const end = formatISO(addDays(endOfMonth(month), 21), { representation: "date" });

      if (typeof window !== "undefined") {
        const cached = window.__availabilityCache;
        if (cached && cached.range.start === start && cached.range.end === end && Date.now() - cached.timestamp < 60_000) {
          setAvailability(new Map(cached.data.map((day) => [day.date, day] as const)));
          setIsLoadingAvailability(false);
          return;
        }
      }

      const response = await fetch(`/api/availability?start=${start}&end=${end}`);
      if (!response.ok) throw new Error("availability");
      const payload = await response.json();
      const days: AvailabilityDay[] = payload.data ?? [];
      setAvailability(new Map(days.map((day) => [day.date, day] as const)));
      if (typeof window !== "undefined") {
        window.__availabilityCache = {
          data: days,
          timestamp: Date.now(),
          range: { start, end },
        };
      }
      if (!selectedDateKey && days.length > 0) {
        const firstAvailable = days.find((day) => day.slots.some((slot) => slot.status !== "booked"));
        if (firstAvailable) {
          setSelectedDateKey(firstAvailable.date);
          const firstSlot = firstAvailable.slots.find((slot) => slot.status !== "booked");
          if (firstSlot) {
            setSelectedSlot({
              date: firstAvailable.date,
              start: firstSlot.start,
              end: firstSlot.end,
            });
          }
        }
      }
    } finally {
      setIsLoadingAvailability(false);
    }
  }
}

function StepCalendar({
  currentMonth,
  onMonthChange,
  availability,
  selectedDateKey,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  loading,
}: {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  availability: AvailabilityDay[];
  selectedDateKey: string | null;
  onSelectDate: (key: string) => void;
  selectedSlot: AvailabilitySlot | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  loading: boolean;
}) {
  const availabilityMap = useMemo(() => new Map(availability.map((day) => [day.date, day] as const)), [availability]);
  const daysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedDay = selectedDateKey ? availabilityMap.get(selectedDateKey) ?? null : null;
  const slots = selectedDay?.slots ?? [];

  return (
    <div className="grid gap-8 md:grid-cols-[1.3fr,0.7fr]">
      <div className="space-y-6">
        <header className="flex items-center justify-between text-text-primary">
          <button
            type="button"
            className="rounded-full border border-border p-2 text-text-muted hover:text-text-primary"
            onClick={() => onMonthChange(addMonths(currentMonth, -1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm uppercase tracking-[0.4em] text-text-muted">{format(currentMonth, "MMMM yyyy")}</div>
          <button
            type="button"
            className="rounded-full border border-border p-2 text-text-muted hover:text-text-primary"
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </header>

        <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.3em] text-text-muted/60">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm">
          {daysInMonth.map((day) => {
            const key = formatISO(day, { representation: "date" });
            const availabilityForDay = availabilityMap.get(key);
            const dayStatus = resolveStatus(availabilityForDay?.slots ?? []);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isSelected = selectedDateKey ? selectedDateKey === key : false;
            const disabled = !availabilityForDay;

            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onSelectDate(key);
                  if (availabilityForDay?.slots?.length) {
                    const first = availabilityForDay.slots.find((slot) => slot.status !== "booked");
                    if (first) onSelectSlot(first);
                  }
                }}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 rounded-full border transition",
                  isCurrentMonth ? "border-border" : "border-border/40 text-text-muted/30",
                  isSelected && "border-primary bg-primary/10 text-primary",
                  disabled && "opacity-40"
                )}
              >
                <span className="text-base font-semibold">{format(day, "d")}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted">
                  {isToday(day) ? "Today" : format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "h-1.5 w-12 rounded-full",
                    dayStatus === "available" && "bg-primary/50",
                    dayStatus === "limited" && "bg-border/60",
                    dayStatus === "booked" && "bg-border/30"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-text-muted">
          <CalendarClock className="h-4 w-4 text-primary" /> Slots
        </h4>
        {loading && (
          <div className="rounded-[24px] border border-border bg-surface px-4 py-3 text-sm text-text-muted">
            Loading availability…
          </div>
        )}
        {!loading && slots.length === 0 && (
          <div className="rounded-[24px] border border-border bg-surface px-4 py-3 text-sm text-text-muted">
            No public slots. Concierge will arrange privately.
          </div>
        )}
        <div className="space-y-2">
          {slots.map((slot) => {
            const start = parseISO(slot.start);
            const end = parseISO(slot.end);
            const isSelected = selectedSlot?.start === slot.start;
            return (
              <button
                key={slot.start}
                type="button"
                disabled={slot.status === "booked"}
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  "w-full rounded-full border px-4 py-3 text-left text-sm transition",
                  slot.status === "available"
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : slot.status === "limited"
                    ? "border-border bg-border/20 text-text-muted"
                    : "border-border bg-border/10 text-text-muted/40",
                  isSelected && "border-primary bg-primary/20 text-primary"
                )}
              >
                {format(start, "h:mm a")} – {format(end, "h:mm a")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepLayout({
  selectedLayout,
  onSelect,
}: {
  selectedLayout: string | null;
  onSelect: (layoutId: string) => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {bookingLayouts.map((layout) => {
        const isActive = selectedLayout === layout.id;
        return (
          <button
            key={layout.id}
            type="button"
            onClick={() => onSelect(layout.id)}
            className={cn(
              "group flex h-full flex-col gap-4 overflow-hidden rounded-[28px] border px-5 py-6 text-left transition",
              isActive ? "border-primary bg-primary/10" : "border-border bg-surface"
            )}
          >
            <div className="relative h-40 overflow-hidden rounded-[20px] border border-border/60">
              <Image
                src={layout.image}
                alt={layout.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 80vw"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg text-text-primary">{layout.title}</h3>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">{layout.capacityLabel}</p>
              <p className="text-sm text-text-muted">{layout.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StepDetails({
  form,
  onChange,
  onSubmit,
  canSubmit,
  detectingMotion,
}: {
  form: FormState;
  onChange: (state: FormState) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  canSubmit: boolean;
  detectingMotion: boolean;
}) {
  return (
    <motion.form
      id="booking-details-form"
      layout
      onSubmit={onSubmit}
      className="grid gap-6 md:grid-cols-3"
      transition={{ duration: detectingMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-text-muted">
        Name
        <div className="relative">
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => onChange({ ...form, name: event.target.value })}
            className="w-full rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {form.name && <Check className="absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" aria-hidden />}
        </div>
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-text-muted">
        Email
        <div className="relative">
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => onChange({ ...form, email: event.target.value })}
            className="w-full rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {form.email && <Check className="absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" aria-hidden />}
        </div>
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-text-muted">
        Phone
        <div className="relative">
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => onChange({ ...form, phone: event.target.value })}
            className="w-full rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Optional"
          />
          {form.phone && <Check className="absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" aria-hidden />}
        </div>
      </label>
      <div className="col-span-full text-xs text-text-muted">
        We&apos;ll confirm by WhatsApp or email within an hour. Guest checkout—no password required.
      </div>
    </motion.form>
  );
}

function ProgressIndicator({ steps, current, total }: { steps: readonly string[]; current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = current > index;
        return (
          <div key={label} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-xs uppercase tracking-[0.3em]",
                isComplete ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted"
              )}
            >
              {stepNumber}
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-text-muted">{label}</span>
            {stepNumber !== steps.length && <span className="h-px w-8 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function resolveStatus(slots: AvailabilitySlot[]): "available" | "limited" | "booked" {
  if (!slots.length) return "booked";
  if (slots.every((slot) => slot.status === "booked")) return "booked";
  if (slots.some((slot) => slot.status === "limited" || slot.status === "booked")) return "limited";
  return "available";
}

function withPrefill(
  url: string,
  params: {
    slot: { start?: string; end?: string; date?: string } | null;
    layout: string | null;
    guest: FormState;
  }
) {
  try {
    const target = new URL(url);
    if (params.slot?.date) target.searchParams.set("date", params.slot.date);
    if (params.slot?.start) target.searchParams.set("start", params.slot.start);
    if (params.slot?.end) target.searchParams.set("end", params.slot.end);
    const notes = [
      params.layout ? `Layout: ${params.layout}` : null,
      params.guest.name ? `Name: ${params.guest.name}` : null,
      params.guest.email ? `Email: ${params.guest.email}` : null,
      params.guest.phone ? `Phone: ${params.guest.phone}` : null,
    ]
      .filter(Boolean)
      .join(" | ");
    if (notes) target.searchParams.set("notes", notes);
    return target.toString();
  } catch (error) {
    return url;
  }
}

export default BookingModal;
