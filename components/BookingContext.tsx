"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface BookingSlot {
  date?: string;
  start?: string;
  end?: string;
}

interface BookingContextValue {
  isOpen: boolean;
  open: (slot?: BookingSlot, source?: string) => void;
  close: () => void;
  setQuoteSummary: (summary: string | null) => void;
  quoteSummary: string | null;
  lastSource: string | null;
  selectedSlot: BookingSlot | null;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quoteSummary, setQuoteSummary] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [lastSource, setLastSource] = useState<string | null>(null);

  const value = useMemo<BookingContextValue>(
    () => ({
      isOpen,
      open: (slot, source) => {
        if (slot) setSelectedSlot(slot);
        if (source) setLastSource(source);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
      setQuoteSummary,
      quoteSummary,
      lastSource,
      selectedSlot,
    }),
    [isOpen, quoteSummary, selectedSlot, lastSource]
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
