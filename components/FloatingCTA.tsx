"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { useMagnetic } from "@/hooks/useMagnetic";
import { useBooking } from "@/components/BookingContext";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function FloatingCTA() {
  const { open } = useBooking();
  const [highlightBooking, setHighlightBooking] = useState(false);
  const magnetic = useMagnetic({ strength: 0.12 });
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const attachObserver = () => {
      if (cancelled) return;
      const bookingSection = document.getElementById("booking");
      if (!bookingSection) {
        requestAnimationFrame(attachObserver);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target.id === "booking") {
              setHighlightBooking(entry.isIntersecting);
            }
          });
        },
        { threshold: 0.4 }
      );

      observer.observe(bookingSection);
    };

    attachObserver();

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  const handleClick = () => {
    if (highlightBooking) {
      document
        .getElementById("booking")
        ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "scroll" });
      return;
    }

    open(undefined, "fab");
    trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "book" });
  };

  return (
    <button
      type="button"
      className={cn(
        "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition",
        highlightBooking
          ? "bg-border/80 text-text-muted hover:bg-border hover:text-text-primary"
          : "bg-primary text-background hover:bg-primary/80"
      )}
      onClick={handleClick}
      ref={magnetic.ref as RefObject<HTMLButtonElement>}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      style={magnetic.style}
    >
      <Sparkles className="h-4 w-4" />
      {highlightBooking ? "Scroll to Booking" : "Book the Studio"}
    </button>
  );
}
