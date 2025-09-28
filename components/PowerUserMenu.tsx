"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Download, Headphones, Timer } from "lucide-react";

import { useBooking } from "@/components/BookingContext";
import { bookingLayouts } from "@/lib/data";

interface StoredSession {
  slot?: { start?: string; end?: string };
  layout?: string | null;
  summary?: string | null;
}

const STORAGE_KEY = "pb:last-session";

export function PowerUserMenu() {
  const { open, selectedSlot, selectedLayout, setSelectedLayout, quoteSummary } = useBooking();
  const [visible, setVisible] = useState(false);
  const [storedSession, setStoredSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    if (quoteSummary || selectedSlot?.start || selectedLayout) {
      const payload: StoredSession = { slot: selectedSlot ?? undefined, layout: selectedLayout ?? null, summary: quoteSummary ?? undefined };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setStoredSession(payload);
    }
  }, [quoteSummary, selectedSlot, selectedLayout]);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) setStoredSession(JSON.parse(existing));
    } catch (error) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        setVisible((prev) => !prev);
      } else if (event.key === "Escape") {
        setVisible(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    let timer: number | null = null;
    const handleTouchStart = () => {
      timer = window.setTimeout(() => setVisible(true), 600);
    };
    const clear = () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", clear, { passive: true });
    window.addEventListener("touchcancel", clear, { passive: true });
    return () => {
      clear();
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", clear);
      window.removeEventListener("touchcancel", clear);
    };
  }, []);

  const layoutLabel = useMemo(() => bookingLayouts.find((layout) => layout.id === storedSession?.layout)?.title, [storedSession?.layout]);

  const handleQuickRebook = () => {
    if (!storedSession?.slot?.start) return;
    open(storedSession.slot, "power-user");
    if (storedSession.layout) {
      setTimeout(() => setSelectedLayout(storedSession.layout ?? null), 10);
    }
    setVisible(false);
  };

  const handleDownload = () => {
    window.open("https://podcastbangalore.example/downloads", "_blank", "noopener");
    setVisible(false);
  };

  const handleTechSupport = () => {
    window.location.href = "mailto:tech@podcastbangalore.com";
    setVisible(false);
  };

  const handleNotifications = () => {
    window.alert("We will notify you when your preferred slots open up.");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md space-y-6 rounded-[32px] border border-border bg-background/95 p-8 text-text-primary shadow-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg">Power shortcuts</h3>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.3em] text-text-muted"
                onClick={() => setVisible(false)}
              >
                Close
              </button>
            </div>
            <p className="text-sm text-text-muted">
              Shift + P opens this menu. Long-press on mobile to reveal the same quick actions.
            </p>
            <div className="space-y-4 text-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[24px] border border-border px-4 py-3 text-left transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleQuickRebook}
                disabled={!storedSession?.slot?.start}
              >
                <span>
                  Quick rebook
                  <span className="block text-xs uppercase tracking-[0.3em] text-text-muted">
                    {storedSession?.summary ?? "No recent session stored"}
                  </span>
                </span>
                <Timer className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[24px] border border-border px-4 py-3 text-left transition hover:border-primary"
                onClick={handleDownload}
              >
                <span>
                  Download last files
                  <span className="block text-xs uppercase tracking-[0.3em] text-text-muted">Secure link, expires in 7 days</span>
                </span>
                <Download className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[24px] border border-border px-4 py-3 text-left transition hover:border-primary"
                onClick={handleTechSupport}
              >
                <span>
                  Direct tech support
                  <span className="block text-xs uppercase tracking-[0.3em] text-text-muted">Engineer on call 9a–11p</span>
                </span>
                <Headphones className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[24px] border border-border px-4 py-3 text-left transition hover:border-primary"
                onClick={handleNotifications}
              >
                <span>
                  Preferred slot alerts
                  <span className="block text-xs uppercase tracking-[0.3em] text-text-muted">We&apos;ll ping you when your timing opens</span>
                </span>
                <Calendar className="h-4 w-4" />
              </button>
            </div>
            {layoutLabel && (
              <div className="rounded-[24px] border border-border bg-surface px-4 py-3 text-xs uppercase tracking-[0.3em] text-text-muted">
                Last configuration: {layoutLabel}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PowerUserMenu;
