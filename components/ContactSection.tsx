export function ContactSection() {
  return (
    <section id="contact" className="bg-elevated py-24">
      <div className="section-wrapper grid gap-10 lg:grid-cols-[0.8fr,1.2fr] lg:items-start">
        <div className="space-y-5">
          <span className="tagline">Book</span>
          <h2 className="text-3xl font-semibold text-contrast sm:text-4xl">Let’s plan your next recording.</h2>
          <p className="text-sm text-muted">
            Tell us about the project, the voices involved, and the timeline. We’ll shape a schedule, hold studio time, and prepare
            the room before you arrive.
          </p>
          <div className="space-y-3 text-sm text-muted">
            <p>
              <strong className="text-contrast">Studio</strong> – 18 Residency Road, Bengaluru
            </p>
            <p>
              <strong className="text-contrast">Call</strong> – <a href="tel:+919900112233" className="text-contrast">+91 9900 112233</a>
            </p>
            <p>
              <strong className="text-contrast">Email</strong> –
              <a href="mailto:concierge@podcastbangalore.com" className="text-contrast"> concierge@podcastbangalore.com</a>
            </p>
          </div>
        </div>
        <form className="space-y-4 rounded-3xl border border-border bg-background px-6 py-8 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-muted">
              Name
              <input
                required
                type="text"
                className="rounded-full border border-border bg-white px-5 py-3 text-sm text-contrast focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-muted">
              Email
              <input
                required
                type="email"
                className="rounded-full border border-border bg-white px-5 py-3 text-sm text-contrast focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-muted">
            Project details
            <textarea
              required
              rows={5}
              className="rounded-3xl border border-border bg-white px-5 py-3 text-sm text-contrast focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Format, guests, timelines, anything else."
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-contrast px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-background transition-colors hover:bg-contrast/90"
          >
            Submit enquiry
          </button>
          <p className="text-xs text-muted">We reply within one working hour. Same-day sessions available on request.</p>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
