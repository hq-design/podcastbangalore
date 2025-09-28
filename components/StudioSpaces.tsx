"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { studioSpaces } from "@/lib/data";

export function StudioSpaces() {
  return (
    <section
      id="studios"
      className="relative mx-auto max-w-6xl px-6 py-24 text-white"
    >
      <div className="mb-12 space-y-4">
        <span className="text-sm uppercase tracking-[0.4em] text-white/40">Our studios</span>
        <h2 className="font-display text-4xl leading-tight md:text-5xl">
          Three distinct spaces crafted for every podcast format.
        </h2>
        <p className="max-w-2xl text-lg text-white/70">
          From prime-time interviews to immersive creator collabs, choose the room that matches your storytelling style and scale.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {studioSpaces.map((space, index) => (
          <motion.article
            key={space.name}
            className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={space.image}
                alt={space.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-2 px-6 pb-6">
                <h3 className="font-display text-2xl text-white">{space.name}</h3>
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">{space.tagline}</p>
                <p className="text-sm text-white/70">{space.spec}</p>
              </div>
            </div>
            <div className="space-y-3 px-6 py-6 text-sm text-white/75">
              {space.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="h-1.5 w-16 rounded-full bg-primary/60" aria-hidden />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default StudioSpaces;
