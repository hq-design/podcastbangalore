'use client';

import Image from "next/image";
import { useState } from "react";

import { capacityOptions } from "@/lib/data";

export function CapacitySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOption = capacityOptions[activeIndex] ?? capacityOptions[0];

  return (
    <section id="formats" className="bg-background py-24">
      <div className="section-wrapper space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-4">
            <span className="tagline">Formats</span>
            <h2 className="text-3xl font-semibold text-contrast sm:text-4xl">Staged for 1 to 4 voices.</h2>
            <p className="text-sm text-muted">
              Whether it is a solo founder update or a moderated panel, every layout is pre-lit, miked, and monitored so you walk straight
              into the conversation.
            </p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-border bg-elevated">
            <Image
              src={activeOption.image.src}
              alt={activeOption.image.alt}
              width={1280}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
          </figure>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {capacityOptions.map((option, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${option.count}-${option.title}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                className={`card space-y-5 px-6 py-6 text-left transition ${
                  isActive ? "border-accent shadow-soft" : "hover:border-accent/60"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-semibold text-accent">{option.count}</span>
                  <span className="text-xs uppercase tracking-[0.4em] text-muted">{option.label}</span>
                </div>
                <h3 className="text-lg font-semibold text-contrast">{option.title}</h3>
                <p className="text-sm text-muted">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CapacitySection;
