"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { testimonials } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1280) setPerView(3);
      else if (width >= 768) setPerView(2);
      else setPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const maxIndex = Math.max(0, testimonials.length - perView);
  const clampedIndex = Math.min(index, maxIndex);

  useEffect(() => {
    if (clampedIndex !== index) {
      setIndex(clampedIndex);
    }
  }, [clampedIndex, index]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between text-white">
        <div>
          <span className="text-sm uppercase tracking-widest text-primary">Trusted by leading voices</span>
          <h2 className="font-display text-3xl">Creators rave about the experience.</h2>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button
            className="rounded-full border border-white/20 p-2 text-white/70 transition hover:text-white"
            onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="rounded-full border border-white/20 p-2 text-white/70 transition hover:text-white"
            onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: `${(-clampedIndex * 100) / perView}%` }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: `${(testimonials.length * 100) / perView}%` }}
        >
          {testimonials.map((testimonial, idx) => (
            <article
              key={testimonial.name}
              className={cn(
                "glass-panel relative flex h-full flex-col gap-6 p-6",
                idx >= clampedIndex && idx < clampedIndex + perView ? "opacity-100" : "opacity-60"
              )}
              aria-live={idx === clampedIndex ? "polite" : undefined}
              style={{ width: `${100 / perView}%`, flex: "0 0 auto" }}
            >
              <Quote className="h-10 w-10 text-primary/60" />
              <p className="text-base text-white/80">{testimonial.quote}</p>
              <div className="mt-auto flex items-center gap-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="text-sm text-white/70">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div>{testimonial.title}</div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: testimonials.length }).map((_, dotIndex) => (
          <button
            key={dotIndex}
            className={cn(
              "h-2 w-2 rounded-full transition",
              dotIndex === clampedIndex ? "bg-primary" : "bg-white/20"
            )}
            onClick={() => setIndex(dotIndex)}
            aria-label={`Go to testimonial ${dotIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
