"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface BookingSlot {
  date?: string;
  start?: string;
  end?: string;
}

interface GuestDetails {
  name: string;
  email: string;
  phone?: string;
}

interface BookingContextValue {
  isOpen: boolean;
  open: (slot?: BookingSlot, source?: string) => void;
  close: () => void;
  setQuoteSummary: (summary: string | null) => void;
  quoteSummary: string | null;
  lastSource: string | null;
  selectedSlot: BookingSlot | null;
  setSelectedSlot: (slot: BookingSlot | null) => void;
  selectedLayout: string | null;
  setSelectedLayout: (layout: string | null) => void;
  guestDetails: GuestDetails | null;
  setGuestDetails: (details: GuestDetails | null) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quoteSummary, setQuoteSummary] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [lastSource, setLastSource] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [guestDetails, setGuestDetails] = useState<GuestDetails | null>(null);

  const value = useMemo<BookingContextValue>(
    () => ({
      isOpen,
      open: (slot, source) => {
        setSelectedSlot(slot ?? null);
        if (source) setLastSource(source);
        setSelectedLayout(null);
        setGuestDetails(null);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
      setQuoteSummary,
      quoteSummary,
      lastSource,
      selectedSlot,
      setSelectedSlot,
      selectedLayout,
      setSelectedLayout,
      guestDetails,
      setGuestDetails,
    }),
    [isOpen, quoteSummary, selectedSlot, lastSource, selectedLayout, guestDetails]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}
