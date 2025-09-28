import { amenities } from "@/lib/data";

export function AmenitiesSection() {
  return (
    <section
      id="inclusions"
      className="relative mx-auto max-w-6xl px-6 py-24 text-white"
    >
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <span className="text-sm uppercase tracking-[0.4em] text-white/40">
            Included in every booking
          </span>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Everything your production needs before you even ask.
          </h2>
          <p className="max-w-2xl text-lg text-white/70">
            Premium gear, hospitality, and human support come standard. Your crew focuses on the story while we orchestrate the rest.
          </p>
        </div>
        <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-primary/80">
          Concierge amenities
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {amenities.map((amenity) => (
          <article key={amenity.title} className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="font-display text-2xl text-white">{amenity.title}</h3>
            <ul className="mt-6 space-y-4 text-sm text-white/75">
              {amenity.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AmenitiesSection;
