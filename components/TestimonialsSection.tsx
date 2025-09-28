import { testimonials } from "@/lib/data";

export function TestimonialsSection() {
  return (
    <section id="clients" className="section-wrapper space-y-10 py-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="tagline">Testimonials</span>
          <h2 className="mt-2 text-3xl font-semibold text-contrast sm:text-4xl">Trusted by the voices you follow.</h2>
        </div>
        <p className="max-w-md text-sm text-muted">
          Founders, filmmakers, and producers across Bengaluru rely on the space for high-stakes launches, interviews, and series work.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((item) => (
          <blockquote key={item.author} className="card space-y-4 px-6 py-6">
            <p className="text-lg leading-relaxed text-contrast">{item.quote}</p>
            <footer className="text-sm uppercase tracking-[0.3em] text-muted">
              {item.author} • {item.role}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
