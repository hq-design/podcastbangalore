"use client";

import { type ComponentType, useEffect, useMemo, useState } from "react";
import { Calculator, Clock, MonitorPlay, ShieldCheck, UserCog } from "lucide-react";

import type { QuoteBreakdown, QuoteInput } from "@/lib/pricing";
import { useBooking } from "@/components/BookingContext";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface QuoteResponse {
  breakdown: QuoteBreakdown;
  formatted: {
    subtotal: string;
    taxes: string;
    total: string;
  };
}

const defaultPayload: QuoteInput = {
  duration: 3,
  engineer: true,
  multiCam: true,
  afterHours: false,
  rush: false,
};

export function QuoteCalculator() {
  const [form, setForm] = useState<QuoteInput>(defaultPayload);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { open, setQuoteSummary } = useBooking();

  const summary = useMemo(() => {
    if (!quote) return "";
    const addOns = [
      form.engineer && "Engineer",
      form.multiCam && "Multi-cam",
      form.afterHours && "After Hours",
      form.rush && "Rush",
    ]
      .filter(Boolean)
      .join(", ");
    return `Duration: ${form.duration}h${addOns ? ` • ${addOns}` : ""} • Total ${quote.formatted.total}`;
  }, [form, quote]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function fetchQuote() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to calculate quote");
        }
        const data = (await response.json()) as QuoteResponse;
        if (!cancelled) {
          setQuote(data);
          trackEvent(ANALYTICS_EVENTS.QUOTE_CALCULATED, {
            duration: form.duration,
            engineer: form.engineer,
            multiCam: form.multiCam,
            afterHours: form.afterHours,
            rush: form.rush,
            total: data.breakdown.total,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unexpected error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(fetchQuote, 320);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [form]);

  return (
    <section id="pricing" className="glass-panel flex flex-col gap-6 p-8 text-white">
      <div className="flex items-center gap-3 text-white">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Calculator className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-display text-2xl">Instant quote calculator</h3>
          <p className="text-sm text-white/60">Configure your session to get a live estimate. Send it straight into the booking flow when you are ready.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-3 text-sm">
          <span className="flex items-center justify-between text-white/70">
            Duration <span className="font-semibold text-white">{form.duration} hours</span>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={form.duration}
            onChange={(event) => setForm((prev) => ({ ...prev, duration: Number(event.target.value) }))}
            className="h-2 w-full cursor-pointer rounded-full bg-white/20 accent-primary"
            aria-label="Duration in hours"
          />
          <span className="flex justify-between text-xs uppercase tracking-widest text-white/40">
            <span>1h</span>
            <span>4h</span>
            <span>8h</span>
            <span>10h</span>
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Toggle
            icon={UserCog}
            label="Engineer"
            description="On-site engineer"
            active={form.engineer ?? false}
            onToggle={() => setForm((prev) => ({ ...prev, engineer: !prev.engineer }))}
          />
          <Toggle
            icon={MonitorPlay}
            label="Multi-Cam"
            description="Up to 3 angles"
            active={form.multiCam ?? false}
            onToggle={() => setForm((prev) => ({ ...prev, multiCam: !prev.multiCam }))}
          />
          <Toggle
            icon={Clock}
            label="After Hours"
            description="10p – 2a access"
            active={form.afterHours ?? false}
            onToggle={() => setForm((prev) => ({ ...prev, afterHours: !prev.afterHours }))}
          />
          <Toggle
            icon={ShieldCheck}
            label="Rush"
            description="24h turnaround"
            active={form.rush ?? false}
            onToggle={() => setForm((prev) => ({ ...prev, rush: !prev.rush }))}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        {loading && <p>Calculating quote…</p>}
        {error && <p className="text-accent-blue">{error}</p>}
        {quote && !loading && !error && (
          <div className="space-y-4">
            <ul className="space-y-2">
              {quote.breakdown.items.map((item) => (
                <li key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span>${item.amount.toLocaleString()}</span>
                </li>
              ))}
              {quote.breakdown.discounts.map((discount) => (
                <li key={discount.label} className="flex items-center justify-between text-accent-blue">
                  <span>{discount.label}</span>
                  <span>{discount.amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-white">
              <span>Total (incl. taxes)</span>
              <span className="text-lg font-semibold">{quote.formatted.total}</span>
            </div>
            <button
              className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-neon transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onClick={() => {
                if (quote) {
                  setQuoteSummary(summary);
                  open(undefined, "quote");
                }
              }}
            >
              Book with this quote
            </button>
            <p className="text-xs text-white/40">Estimates exclude custom set design and extended crew. Share more details in the booking flow.</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface ToggleProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

function Toggle({ icon: Icon, label, description, active, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left transition",
        active
          ? "border-primary/60 bg-primary/20 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:text-white"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-semibold">{label}</span>
      </div>
      <span className="text-xs uppercase tracking-widest text-white/50">{description}</span>
    </button>
  );
}
