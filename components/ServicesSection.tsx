import { services } from "@/lib/data";

export function ServicesSection() {
  return (
    <section id="services" className="section-wrapper space-y-10 py-24">
      <div className="max-w-2xl space-y-3">
        <span className="tagline">Services</span>
        <h2 className="text-3xl font-semibold text-contrast sm:text-4xl">Everything is handled in-house.</h2>
        <p className="text-sm text-muted">
          Step into a ready-to-record environment complete with direction, engineering, and hospitality. No DIY setup. No unfinished edges.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.title} className="card space-y-3 px-6 py-6">
            <h3 className="text-lg font-semibold text-contrast">{service.title}</h3>
            <p className="text-sm text-muted">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
