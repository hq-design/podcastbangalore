"use client";

import { useState } from "react";

import { useBooking } from "@/components/BookingContext";

export function BookingSection() {
  const { open, setQuoteSummary } = useBooking();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const summaryParts = [
      date ? `Date ${new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : null,
      time ? `Time ${time}` : null,
      notes ? `Contact ${notes}` : null,
    ].filter(Boolean);
    setQuoteSummary(summaryParts.join(" • ") || null);

    open(
      {
        date: date || undefined,
        start: time ? `${date}T${time}:00.000Z` : undefined,
      },
      "booking-section"
    );
  };

  return (
    <section id="booking" className="mx-auto max-w-4xl px-6 py-24 text-text-primary">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-text-muted">Book</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Reserve your session.
          </h2>
          <p className="text-lg text-text-muted">
            Tell us when you want to step into the room. Our concierge will confirm within the hour.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-panel space-y-6 p-8"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em] text-text-muted">
              Date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em] text-text-muted">
              Time
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em] text-text-muted">
              Contact
              <input
                type="text"
                placeholder="Email or phone"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="focus-ring inline-flex items-center justify-center rounded-full border border-primary bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-background transition-colors hover:bg-primary/80"
            >
              Book the Studio
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default BookingSection;
