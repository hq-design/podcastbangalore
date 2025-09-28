"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";

import type { AvailabilityDay } from "@/lib/availability";
import { pricingTiers } from "@/lib/data";
import { useBooking } from "@/components/BookingContext";

const links = [
  { label: "Stories", href: "#stories" },
  { label: "The Space", href: "#space" },
  { label: "Creators", href: "#creators" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [nextSlotLabel, setNextSlotLabel] = useState("Checking availability…");
  const { open } = useBooking();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadAvailability = async () => {
      try {
        const now = new Date();
        const start = now.toISOString().split("T")[0];
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + 21);
        const end = endDate.toISOString().split("T")[0];
        const response = await fetch(`/api/availability?start=${start}&end=${end}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("failed");
        const payload = await response.json();
        if (!mounted) return;
        const days: AvailabilityDay[] = payload.data ?? [];
        setAvailability(days);
        setNextSlotLabel(deriveNextSlotLabel(days) ?? "Next slot: concierge will confirm");
      } catch (error) {
        if (mounted) {
          setNextSlotLabel("Next slot: concierge will confirm");
        }
      }
    };

    loadAvailability();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const isSolid = isScrolled || isMenuOpen;
  const backgroundClass = isSolid ? "bg-background/85 backdrop-blur" : "bg-transparent";
  const borderClass = isSolid ? "border-border/70" : "border-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${backgroundClass} ${borderClass}`}>
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-text-primary">
        <a href="#hero" className="font-display text-xl uppercase tracking-[0.4em]">
          Podcast Bangalore
        </a>

        <nav className="hidden items-center gap-10 text-xs uppercase tracking-[0.4em] text-text-muted md:flex">
          {links.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.label === "The Space" && setIsPricingOpen(true)}
              onMouseLeave={() => link.label === "The Space" && setIsPricingOpen(false)}
              onFocus={() => link.label === "The Space" && setIsPricingOpen(true)}
              onBlur={() => link.label === "The Space" && setIsPricingOpen(false)}
            >
              <a href={link.href} className="transition-colors hover:text-text-primary">
                {link.label}
              </a>
              {link.label === "The Space" && (
                <AnimatePresence>
                  {isPricingOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full z-40 mt-4 w-64 -translate-x-1/2 rounded-[20px] border border-border bg-background/95 p-4 text-left shadow-xl"
                    >
                      <div className="space-y-2 text-[11px] uppercase tracking-[0.3em]">
                        {pricingTiers.map((tier) => (
                          <div key={tier.label} className="flex items-center justify-between text-text-primary">
                            <span>{tier.label}</span>
                            <span className="text-text-muted">{tier.price}</span>
                          </div>
                        ))}
                        <div className="pt-2 text-[10px] text-text-muted">All equipment included</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-text-muted md:flex">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {nextSlotLabel}
          </div>
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setIsCalendarOpen(true)}
            onMouseLeave={() => setIsCalendarOpen(false)}
            onFocus={() => setIsCalendarOpen(true)}
            onBlur={() => setIsCalendarOpen(false)}
          >
            <button
              type="button"
              onClick={() => open(undefined, "nav")}
              className="rounded-full border border-primary bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-background transition hover:bg-primary/80"
            >
              Book Studio
            </button>
            <AnimatePresence>
              {isCalendarOpen && availability.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full z-40 mt-4 w-64 rounded-[20px] border border-border bg-background/95 p-4 text-xs text-text-muted shadow-xl"
                >
                  <MiniCalendar availability={availability} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border/60 bg-background/95 px-6 py-6 text-xs uppercase tracking-[0.4em] md:hidden"
          >
            <div className="flex flex-col gap-4 text-text-muted">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  open(undefined, "nav-mobile");
                }}
                className="rounded-full border border-primary bg-primary px-6 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.5em] text-background"
              >
                Book Studio
              </button>
              <a href="tel:+919900112233" className="flex items-center gap-2 text-text-muted">
                <Phone className="h-3 w-3" /> Call Now
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function deriveNextSlotLabel(days: AvailabilityDay[]): string | null {
  for (const day of days) {
    const slot = day.slots?.find((item) => item.status !== "booked");
    if (!slot) continue;
    const start = parseISO(slot.start);
    const prefix = isToday(start) ? "Today" : format(start, "MMM d");
    return `Next slot: ${prefix} ${format(start, "h:mm a")}`;
  }
  return null;
}

function MiniCalendar({ availability }: { availability: AvailabilityDay[] }) {
  const dayNames = useMemo(() => ["S", "M", "T", "W", "T", "F", "S"], []);
  const days = availability.slice(0, 21);

  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-[0.3em] text-text-muted/70">Availability peek</div>
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.3em] text-text-muted/60">
        {dayNames.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {days.map((day) => {
          const date = parseISO(day.date);
          const status = day.slots.every((slot) => slot.status === "booked")
            ? "booked"
            : day.slots.some((slot) => slot.status === "limited")
            ? "limited"
            : "available";
          const baseClasses =
            "flex h-9 flex-col items-center justify-center rounded-full border text-[11px] uppercase tracking-[0.3em]";
          const className =
            status === "available"
              ? `${baseClasses} border-primary/40 bg-primary/10 text-primary`
              : status === "limited"
              ? `${baseClasses} border-border bg-border/30 text-text-muted`
              : `${baseClasses} border-border bg-border/10 text-text-muted/40`;
          return (
            <span key={day.date} className={className}>
              {format(date, "d")}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default Navbar;
