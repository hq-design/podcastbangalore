"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MessageCircle, Phone } from "lucide-react";

import { useMagnetic } from "@/hooks/useMagnetic";
import { useBooking } from "@/components/BookingContext";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { prefetchAvailability } from "@/lib/clientAvailability";
import { cn } from "@/lib/utils";

export function FloatingCTA() {
  const { open } = useBooking();
  const [highlightBooking, setHighlightBooking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  useEffect(() => {
    if (isExpanded) {
      prefetchAvailability();
    }
  }, [isExpanded]);

  const handleScrollToBooking = () => {
    document
      .getElementById("booking")
      ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "scroll" });
  };

  const handleChat = () => {
    window.open(
      "https://wa.me/919900112233?text=Hi%20Podcast%20Bangalore,%20I%20would%20like%20to%20check%20studio%20availability.",
      "_blank",
      "noopener"
    );
    trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "whatsapp" });
    setIsExpanded(false);
  };

  const handleCall = () => {
    window.location.href = "tel:+919900112233";
    trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "call" });
    setIsExpanded(false);
  };

  const handleAvailability = () => {
    if (highlightBooking) {
      handleScrollToBooking();
    } else {
      open(undefined, "fab");
    }
    prefetchAvailability();
    trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "availability" });
    setIsExpanded(false);
  };

  return (
    <div
      className="fixed right-6 bottom-[88px] z-40 md:bottom-6"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocus={() => setIsExpanded(true)}
      onBlur={() => setIsExpanded(false)}
    >
      <motion.div
        layout
        className="flex flex-col items-end gap-3"
        transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="card-panel flex w-56 flex-col gap-2 px-4 py-3 text-xs uppercase tracking-[0.3em]"
            >
              <button
                type="button"
                className="flex items-center justify-between text-text-muted transition hover:text-text-primary"
                onClick={handleChat}
              >
                <span>Chat on WhatsApp</span>
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex items-center justify-between text-text-muted transition hover:text-text-primary"
                onClick={handleCall}
              >
                <span>Call Now</span>
                <Phone className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex items-center justify-between text-text-muted transition hover:text-text-primary"
                onClick={handleAvailability}
              >
                <span>Quick Availability Check</span>
                <Calendar className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-expanded={isExpanded}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition",
            highlightBooking
              ? "border border-border bg-border/80 text-text-muted hover:bg-border hover:text-text-primary"
              : "bg-primary text-background hover:bg-primary/80"
          )}
          onClick={() => setIsExpanded((prev) => !prev)}
          ref={magnetic.ref as RefObject<HTMLButtonElement>}
          onPointerMove={magnetic.onPointerMove}
          onPointerLeave={magnetic.onPointerLeave}
          style={magnetic.style}
          aria-label="Open quick actions"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </motion.div>
    </div>
  );
}
