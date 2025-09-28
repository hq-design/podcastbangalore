"use client";

import { motion } from "framer-motion";
import { Headphones, Play } from "lucide-react";
import { type RefObject, useEffect, useMemo, useState } from "react";

import { useAudioViz } from "@/hooks/useAudioViz";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useParallax } from "@/hooks/useParallax";
import { useScrollHue } from "@/hooks/useScrollHue";
import { stats } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useBooking } from "@/components/BookingContext";

const words = ["Pro", "Effortless", "Cinematic"];
const HERO_VIDEO =
  process.env.NEXT_PUBLIC_HERO_VIDEO ??
  "https://cdn.coverr.co/videos/coverr-studio-sneak-peek-1700844879874?download=1";
const HERO_POSTER =
  process.env.NEXT_PUBLIC_HERO_POSTER ??
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80";

export function Hero() {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [displayed, setDisplayed] = useState(words[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(words[0].length);
  const { open } = useBooking();
  const primaryMagnetic = useMagnetic({ strength: 0.08 });
  const parallax = useParallax({ strength: 0.3 });
  const { style: hueStyle } = useScrollHue({ start: 0, end: 22, triggerEnd: 0.5 });
  const audioViz = useAudioViz();

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(currentWord);
      return;
    }
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const word = currentWord;
    if (!isDeleting && charIndex < word.length) {
      timeout = setTimeout(() => setCharIndex((index) => index + 1), 90);
    } else if (!isDeleting && charIndex === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((index) => index - 1), 45);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      const next = (words.indexOf(word) + 1) % words.length;
      setCurrentWord(words[next]);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [charIndex, currentWord, isDeleting, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(currentWord);
      return;
    }
    setDisplayed(currentWord.slice(0, charIndex));
  }, [charIndex, currentWord, prefersReducedMotion]);

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-black text-white"
      style={hueStyle}
    >
      <div className="absolute inset-0 -z-10 animate-shimmer bg-hero-gradient"></div>
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_POSTER}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 pb-32 pt-32">
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/60"
          >
            Elite Gear • Cinematic Lighting • On-Site Engineers
          </motion.div>

          <motion.h1
            className="font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Record Your Podcast Like a <span className="text-primary">Pro</span>.
            <br className="hidden sm:block" />
            <span className="text-white">
              World-class studio. Elite gear. On-site support.
            </span>
            <br />
            <span className="inline-flex items-center gap-2 text-primary">
              <span>{prefersReducedMotion ? currentWord : displayed}</span>
              <span className="inline-block h-6 w-[2px] animate-pulse-soft bg-primary/80" />
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg text-white/70"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Book a world-class studio with cinematic multi-cam capture, premium audio, and concierge engineering. Availability updates in real time so you can lock your slot in under 60 seconds.
          </motion.p>

          <motion.div
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-white shadow-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:bg-primary/90"
              onPointerMove={primaryMagnetic.onPointerMove}
              onPointerLeave={primaryMagnetic.onPointerLeave}
              onClick={() => open(undefined, "hero-cta")}
              ref={primaryMagnetic.ref as RefObject<HTMLButtonElement>}
              style={primaryMagnetic.style}
            >
              Book Your Studio Session
            </button>

            <div className="flex flex-wrap gap-3 text-sm text-white/60">
              <a
                className="glass-panel inline-flex items-center gap-2 px-4 py-2 hover:text-white"
                href="#tour"
              >
                <Play className="h-4 w-4" /> Take Virtual Tour
              </a>
              <a className="glass-panel inline-flex items-center gap-2 px-4 py-2 hover:text-white" href="#equipment">
                <Headphones className="h-4 w-4" /> See Equipment List
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-6 sm:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="glass-panel flex flex-col gap-1 p-6"
            >
              <span className="text-3xl font-semibold text-white">{stat.value}</span>
              <span className="text-sm uppercase tracking-wide text-white/60">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-12"
        ref={parallax.ref as RefObject<HTMLDivElement>}
        style={parallax.style}
      >
        <div className="glass-panel flex max-w-lg items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-1 text-accent-green">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-green" />
            Live Availability
          </div>
          <p className="text-sm text-white/70">Updated moments ago — prime slots still open this week.</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 flex h-24 items-end justify-center gap-1 px-8 pb-6 opacity-90">
        {audioViz.values.map((value, index) => (
          <span
            key={index}
            className={cn("w-1 rounded-t-full bg-gradient-to-t from-primary/40 via-primary to-accent-blue/80", prefersReducedMotion && "hidden")}
            style={{ height: `${Math.max(12, value * 120)}px` }}
          />
        ))}
      </div>
    </section>
  );
}
