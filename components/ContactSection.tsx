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
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24 text-white">
      <div className="mb-10 max-w-2xl space-y-4">
        <span className="text-sm uppercase tracking-widest text-primary">Concierge support</span>
        <h2 className="font-display text-4xl leading-tight">Need custom crew, set design, or brand experiences?</h2>
        <p className="text-lg text-white/70">
          Tell us about your production goals and our producers will craft a tailored package. Same-day turnarounds available for rush bookings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <form onSubmit={handleSubmit} className="glass-panel space-y-4 p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Name
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
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
                className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
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
                className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="+1 (000) 000-0000"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Preferred date
              <input
                type="date"
                value={form.preferredDate}
                onChange={(event) => setForm((prev) => ({ ...prev, preferredDate: event.target.value }))}
                className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
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
              className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="Share your show format, crew needs, or custom requests."
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-neon transition",
              status === "loading" && "opacity-70"
            )}
          >
            {status === "loading" ? "Submitting…" : "Send request"}
          </button>
          {status === "success" && <p className="text-sm text-accent-green">We received your request. Expect a reply within 30 minutes.</p>}
          {status === "error" && <p className="text-sm text-accent-blue">{error ?? "We could not send your message. Try again soon."}</p>}
        </form>

        <div className="space-y-4">
          <div className="glass-panel space-y-4 p-8 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40">Studio line</div>
                <a href="tel:+13105550123" className="text-white hover:text-primary">
                  +1 (310) 555-0123
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40">Email</div>
                <a href="mailto:bookings@podcaststudio.example" className="text-white hover:text-primary">
                  bookings@podcaststudio.example
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40">Hours</div>
                Mon–Fri · 9a–10p &bull; Sat–Sun · 10a–8p PT
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40">Address</div>
                123 Studio Lane, Los Angeles, CA 90028
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <iframe
              title="Studio location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.568869152613!2d-118.3295!3d34.1016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA2JzA1LjciTiAxMTjCsDE5JzQ2LjIiVw!5e0!3m2!1sen!2sus!4v1706426400000!5m2!1sen!2sus"
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
