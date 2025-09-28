"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { useBooking } from "@/components/BookingContext";
import { prefetchAvailability } from "@/lib/clientAvailability";

const HERO_IMAGE =
  process.env.NEXT_PUBLIC_HERO_POSTER ??
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1920&q=80";

export function Hero() {
  const { open } = useBooking();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-background text-text-primary"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Podcast Bangalore studio"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-40">
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex w-max items-center gap-2 self-end rounded-full border border-border bg-background/70 px-4 py-2 text-xs uppercase tracking-[0.4em] text-text-muted"
        >
          From ₹2,500/hour
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl space-y-8"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-text-muted">Podcast Bangalore</p>
          <h1 className="font-display text-4xl leading-tight sm:text-6xl md:text-7xl">
            Where India&apos;s Stories Take Shape
          </h1>
          <p className="text-sm uppercase tracking-[0.4em] text-text-muted">
            Professional recording studio • <abbr title="Mahatma Gandhi Road" className="no-underline">MG Road Bengaluru</abbr> • 1–4 people
          </p>
          <p className="max-w-xl text-lg text-text-muted">
            A recording sanctuary where filmmakers, founders, and cultural voices craft the conversations that move the country forward.
          </p>
          <button
            type="button"
            onClick={() => open(undefined, "hero")}
            onMouseEnter={() => prefetchAvailability()}
            className="focus-ring inline-flex items-center justify-center rounded-full border border-primary bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-background transition-colors hover:bg-primary/80"
          >
            Check Available Slots
          </button>
          <Link
            href="#booking"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-muted hover:text-text-primary"
            onMouseEnter={() => prefetchAvailability()}
          >
            First time? See how it works →
          </Link>
        </motion.div>

        <div className="flex justify-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center gap-3 text-xs tracking-[0.4em] text-text-muted"
          >
            Scroll
            <span className="h-10 w-px bg-text-muted/40" />
          </motion.span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
