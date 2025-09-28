"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";

import { experienceHighlights, workflowSteps } from "@/lib/data";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-6xl px-6 py-24 text-white"
    >
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
            Bangalore • Signature Experience
          </span>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            A luxury podcast flow engineered for creators and brands.
          </h2>
          <p className="max-w-2xl text-lg text-white/70">
            From white-glove arrival to edit-ready deliveries, every step is orchestrated by broadcast producers so your voice is the focus.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <ArrowUpRight className="h-4 w-4 text-primary" />
          <span>Scroll through the experience</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {experienceHighlights.map((highlight, index) => (
          <motion.article
            key={highlight.label}
            className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-primary/70">
              {highlight.label}
            </span>
            <h3 className="font-display text-2xl leading-snug text-white">
              {highlight.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/70">
              {highlight.description}
            </p>
            <ul className="space-y-3 text-sm text-white/75">
              {highlight.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0" />
          </motion.article>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-white/10 bg-black/40 p-8 md:p-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl">How your session runs</h3>
            <p className="text-sm text-white/60">
              Crystal-clear checkpoints keep the energy high while we operate behind the scenes.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/50">
            Concierge workflow
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className="flex h-full flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
                {step.step}
              </span>
              <h4 className="text-lg font-semibold text-white">{step.title}</h4>
              <p className="text-sm leading-relaxed text-white/60">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
