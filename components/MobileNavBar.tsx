"use client";

import { useCallback } from "react";
import { Calendar, Home, MessageCircle, Phone } from "lucide-react";

import { useEffect } from "react";

import { useBooking } from "@/components/BookingContext";
import { prefetchAvailability } from "@/lib/clientAvailability";

export function MobileNavBar() {
  const { open } = useBooking();

  useEffect(() => {
    prefetchAvailability();
  }, []);

  const vibrate = useCallback(() => {
    if (typeof window === "undefined") return;
    if (navigator.vibrate) navigator.vibrate(20);
  }, []);

  const handleBook = () => {
    vibrate();
    open(undefined, "mobile-nav");
    document
      .getElementById("booking")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCall = () => {
    vibrate();
    window.location.href = "tel:+919900112233";
  };

  const handleChat = () => {
    vibrate();
    window.open(
      "https://wa.me/919900112233?text=Hi%20Podcast%20Bangalore,%20I%20would%20like%20to%20check%20studio%20availability.",
      "_blank",
      "noopener"
    );
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background/95 px-2 py-3 text-[11px] uppercase tracking-[0.3em] text-text-muted shadow-2xl md:hidden">
      <a
        href="#hero"
        className="flex flex-col items-center gap-1"
        onClick={vibrate}
      >
        <Home className="h-4 w-4" />
        Home
      </a>
      <button type="button" className="flex flex-col items-center gap-1" onClick={handleBook}>
        <Calendar className="h-4 w-4" />
        Book
      </button>
      <button type="button" className="flex flex-col items-center gap-1" onClick={handleCall}>
        <Phone className="h-4 w-4" />
        Call
      </button>
      <button type="button" className="flex flex-col items-center gap-1" onClick={handleChat}>
        <MessageCircle className="h-4 w-4" />
        Chat
      </button>
    </nav>
  );
}

export default MobileNavBar;
