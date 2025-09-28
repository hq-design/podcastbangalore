import Image from "next/image";

import { studioHighlights } from "@/lib/data";

export function StudiosSection() {
  return (
    <section id="studios" className="section-wrapper space-y-10 py-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="tagline">Studios</span>
          <h2 className="mt-2 text-3xl font-semibold text-contrast sm:text-4xl">One address, three curated environments.</h2>
        </div>
        <p className="max-w-md text-sm text-muted">
          Switch from intimate fireside chats to live-on-stage energy in minutes. Every set is pre-lit, miked, and engineered for the
          format you’re building.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {studioHighlights.map((studio) => (
          <article key={studio.title} className="card overflow-hidden">
            <div className="relative h-56 w-full">
              <Image src={studio.image} alt={studio.title} fill className="object-cover" />
            </div>
            <div className="space-y-3 px-6 py-5">
              <h3 className="text-lg font-semibold text-contrast">{studio.title}</h3>
              <p className="text-sm text-muted">{studio.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StudiosSection;
