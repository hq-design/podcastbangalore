"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { setupLayouts, studioSpaces } from "@/lib/data";

export function StudioSpaces() {
  const space = studioSpaces[0];
  if (!space) {
    return null;
  }
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLayout = setupLayouts[activeIndex];

  return (
    <section
      id="studios"
      className="relative mx-auto max-w-6xl px-6 py-24 text-white"
    >
      <div className="mb-12 space-y-4">
        <span className="text-sm uppercase tracking-[0.4em] text-white/40">Signature suite</span>
        <h2 className="font-display text-4xl leading-tight md:text-5xl">
          One cinematic set, tailored for up to four voices.
        </h2>
        <p className="max-w-2xl text-lg text-white/70">
          Our Koramangala conversation suite reshapes in minutes—so whether it’s a solo drop or a four-person roundtable, your show looks immaculate.
        </p>
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <motion.div
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={space.image}
              alt={space.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 540px, 90vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-2 px-8 pb-8">
              <h3 className="font-display text-3xl text-white">{space.name}</h3>
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">{space.tagline}</p>
              <p className="text-sm text-white/70">{space.spec}</p>
            </div>
          </div>
          <div className="space-y-4 px-8 py-6 text-sm text-white/80">
            <p className="text-base text-white/75">{space.description}</p>
            <ul className="space-y-3">
              {space.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-12 rounded-full bg-primary/60" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {setupLayouts.map((layout, index) => (
              <button
                key={layout.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-full border px-4 py-2 text-sm uppercase tracking-[0.3em] transition ${
                  activeIndex === index
                    ? "border-primary/80 bg-primary/20 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {layout.seats}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeLayout.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.4em] text-white/40">Configuration</span>
                  <h3 className="mt-2 font-display text-2xl text-white">{activeLayout.title}</h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                  {activeLayout.seats}
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70">{activeLayout.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                {activeLayout.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-sm text-white/70">
            <span className="text-xs uppercase tracking-[0.4em] text-primary/80">Need more?</span>
            <p className="mt-3 text-white/80">
              Styling, branding panels, and custom prop dressing are handled in-house—tell us your mood board and we’ll stage the set before you arrive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudioSpaces;
