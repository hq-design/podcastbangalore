"use client";

import { type RefObject, useEffect, useState } from "react";
import { Menu, Podcast } from "lucide-react";

import { useMagnetic } from "@/hooks/useMagnetic";
import { useBooking } from "@/components/BookingContext";
import { cn } from "@/lib/utils";

const links = [
  { label: "Experience", href: "#experience" },
  { label: "Studios", href: "#studios" },
  { label: "Inclusions", href: "#inclusions" },
  { label: "Availability", href: "#availability" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { open } = useBooking();
  const magnetic = useMagnetic({ strength: 0.12 });

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        isScrolled ? "backdrop-blur-xl border-b border-white/10 bg-black/60" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm">
        <a href="#hero" className="flex items-center gap-2 font-display text-lg tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 text-primary">
            <Podcast className="h-5 w-5" />
          </span>
          Ultimate Podcast Studio
        </a>

        <nav className="hidden items-center gap-8 text-text-muted md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative transition-colors hover:text-white focus:outline-none focus-visible:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="inline-flex h-11 items-center justify-center rounded-full border border-primary/60 bg-primary/20 px-6 font-semibold tracking-tight text-white shadow-neon transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:shadow-lg hover:shadow-primary/50"
            onPointerMove={magnetic.onPointerMove}
            onPointerLeave={magnetic.onPointerLeave}
            onClick={() => open(undefined, "nav")}
            ref={magnetic.ref as RefObject<HTMLButtonElement>}
            style={magnetic.style}
          >
            Book Now
          </button>

          <button className="md:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
