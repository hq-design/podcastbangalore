"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Loader2, Phone } from "lucide-react";

import { useBooking } from "@/components/BookingContext";
import { cn } from "@/lib/utils";

const bookingUrl = process.env.NEXT_PUBLIC_CAL_URL ?? "https://cal.com/your-studio/60";

export function BookingModal() {
  const { isOpen, close, quoteSummary, selectedSlot } = useBooking();
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setIsLoaded(false);
    }
  }, [isOpen]);

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
            className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[40px] border border-border bg-background"
            initial={{ y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-4 text-text-primary">
              <div>
                <h3 className="font-display text-xl">Confirm your session</h3>
                <p className="text-sm text-text-muted">
                  Finalize the time or forward details to the concierge team.
                </p>
              </div>
              <button
                className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.4em] text-text-muted hover:text-text-primary"
                onClick={close}
              >
                Close
              </button>
            </header>

            {quoteSummary && (
              <div className="border-b border-border bg-surface px-6 py-3 text-xs uppercase tracking-[0.3em] text-text-muted">
                {quoteSummary}
              </div>
            )}

            {selectedSlot && (
              <div className="flex items-center gap-3 border-b border-border bg-surface px-6 py-3 text-sm text-text-muted">
                <CalendarClock className="h-4 w-4 text-primary" />
                <span>
                  Preferred slot: {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
                </span>
              </div>
            )}

            <div className="relative flex-1 bg-background">
              {!isLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-sm text-text-muted">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  Opening booking portal…
                </div>
              )}
              <iframe
                key={bookingUrl}
                src={withPrefill(bookingUrl, quoteSummary, selectedSlot)}
                className={cn("h-full w-full", !isLoaded && "opacity-0")}
                onLoad={() => setIsLoaded(true)}
                title="Booking"
                allow="camera; microphone; clipboard-write"
              />
            </div>

            <div className="grid gap-3 border-t border-border bg-surface px-6 py-4 text-sm text-text-muted md:grid-cols-3">
              <div>
                Prefer concierge?
                <a href="tel:+919900112233" className="flex items-center gap-2 text-text-primary hover:text-primary">
                  <Phone className="h-4 w-4" /> +91 9900 112233
                </a>
              </div>
              <div className="md:col-span-2">
                Portal not loading? Email <a className="text-text-primary hover:text-primary" href="mailto:concierge@podcastbangalore.com">concierge@podcastbangalore.com</a> and we&apos;ll secure your slot manually.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatTime(iso?: string) {
  if (!iso) return "TBD";
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return "TBD";
  }
}

function withPrefill(url: string, note?: string | null, slot?: { start?: string; end?: string; date?: string } | null) {
  try {
    const target = new URL(url);
    if (note) {
      target.searchParams.set("notes", note);
    }
    if (slot?.date) {
      target.searchParams.set("date", slot.date);
    }
    if (slot?.start) {
      target.searchParams.set("start", slot.start);
    }
    if (slot?.end) {
      target.searchParams.set("end", slot.end);
    }
    return target.toString();
  } catch (error) {
    return url;
  }
}
