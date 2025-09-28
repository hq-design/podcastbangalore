"use client";

import { useState } from "react";
import Image from "next/image";

import { spaceGallery } from "@/lib/data";

export function SpaceSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = spaceGallery[activeIndex] ?? spaceGallery[0];

  return (
    <section id="space" className="mx-auto max-w-6xl px-6 py-24 text-text-primary">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-text-muted">The Space</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            One space. Infinite possibilities.
          </h2>
          <p className="max-w-xl text-sm text-text-muted">
            A single studio composed like a film set—move a chair, dim a bank of lights, and the room tells a new story without ever breaking the spell.
          </p>
        </div>
        <div className="flex gap-3">
          {spaceGallery.map((frame, index) => (
            <button
              key={frame.label}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                index === activeIndex ? "border-primary" : "border-border"
              }`}
              aria-label={frame.label}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  index === activeIndex ? "bg-primary" : "bg-text-muted/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="relative overflow-hidden rounded-[40px] border border-border">
          <Image
            src={active.image}
            alt={active.label}
            width={1600}
            height={900}
            className="h-full w-full object-cover"
            sizes="100vw"
            priority={activeIndex === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 w-full px-6 py-6 text-sm text-text-muted">
            {active.caption}
          </div>
        </div>
      )}
    </section>
  );
}

export default SpaceSection;
