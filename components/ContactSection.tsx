"use client";

import { FormEvent, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate: string;
}

function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, message: form.message.trim() }),
      });
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      setStatus("success");
      trackEvent(ANALYTICS_EVENTS.CONTACT_SUBMITTED, {
        preferredDate: form.preferredDate,
      });
      setForm({ name: "", email: "", phone: "", message: "", preferredDate: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
      trackEvent(ANALYTICS_EVENTS.CONTACT_FAILED, {});
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24 text-text-primary">
      <div className="mb-10 max-w-2xl space-y-4">
        <span className="text-sm uppercase tracking-[0.4em] text-text-muted">Concierge</span>
        <h2 className="font-display text-4xl leading-tight">Need a closer conversation?</h2>
        <p className="text-lg text-text-muted">
          Share what you&apos;re creating and the team will arrange a walkthrough, hold dates, or craft a bespoke experience.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <form onSubmit={handleSubmit} className="card-panel space-y-4 p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Name
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Your name"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@email.com"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Phone (optional)
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="+91 00000 00000"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Preferred date
              <input
                type="date"
                value={form.preferredDate}
                onChange={(event) => setForm((prev) => ({ ...prev, preferredDate: event.target.value }))}
                className="rounded-full border border-border bg-transparent px-5 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            Project details
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              className="rounded-[32px] border border-border bg-transparent px-5 py-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Share the story you want to tell."
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-full border border-primary bg-primary px-8 text-sm font-semibold uppercase tracking-[0.3em] text-background transition",
              status === "loading" && "opacity-70"
            )}
          >
            {status === "loading" ? "Submitting…" : "Send request"}
          </button>
          {status === "success" && <p className="text-sm text-primary">We&apos;ll be in touch shortly.</p>}
          {status === "error" && <p className="text-sm text-text-muted">{error ?? "We could not send your message. Try again soon."}</p>}
        </form>

        <div className="space-y-4">
          <div className="card-panel space-y-4 p-8 text-sm text-text-muted">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-text-muted">Studio line</div>
                <a href="tel:+919900112233" className="text-text-primary hover:text-primary">
                  +91 9900 112233
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-text-muted">Email</div>
                <a href="mailto:concierge@podcastbangalore.com" className="text-text-primary hover:text-primary">
                  concierge@podcastbangalore.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-text-muted">Hours</div>
                Every day · 9a–11p IST · After-hours on request
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-text-muted">Address</div>
                18 Residency Road, Shanthala Nagar, Bengaluru 560025
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-border">
            <iframe
              title="Studio location"
              src="https://maps.google.com/maps?q=Residency%20Road%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="280"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export { ContactSection };
export default ContactSection;
