"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { useMagnetic } from "@/hooks/useMagnetic";
import { useBooking } from "@/components/BookingContext";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function FloatingCTA() {
  const { open } = useBooking();
  const [variant, setVariant] = useState<"book" | "quote">("book");
  const magnetic = useMagnetic({ strength: 0.12 });
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections: Array<{ id: string; variant: "book" | "quote" }> = [
      { id: "availability", variant: "book" },
      { id: "pricing", variant: "quote" },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = sections.find((section) => section.id === entry.target.id);
            if (matched) {
              setVariant(matched.variant);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (variant === "book") {
      open(undefined, "fab");
      trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "book" });
    } else {
      document.getElementById("pricing")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      trackEvent(ANALYTICS_EVENTS.FAB_CTA, { variant: "quote" });
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-neon transition",
        variant === "book"
          ? "bg-primary hover:bg-primary/90"
          : "bg-accent-blue/80 hover:bg-accent-blue"
      )}
      onClick={handleClick}
      ref={magnetic.ref as RefObject<HTMLButtonElement>}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      style={magnetic.style}
    >
      <Sparkles className="h-4 w-4" />
      {variant === "book" ? "Book Now" : "Get Instant Quote"}
    </button>
  );
}
