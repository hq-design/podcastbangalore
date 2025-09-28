"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { type RefObject, useMemo, useState } from "react";

import { equipmentGrid } from "@/lib/data";
import { useTilt } from "@/hooks/useTilt";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

export function EquipmentGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <section id="equipment" className="space-y-8">
      <div className="flex flex-col gap-3 text-white lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-sm uppercase tracking-widest text-primary">Gear arsenal</span>
          <h2 className="font-display text-3xl">Broadcast-ready equipment included with every booking.</h2>
        </div>
        <p className="max-w-xl text-sm text-white/60">
          Tap a tile to view the full spec sheet. All equipment is pre-calibrated, sanitized between sessions, and supported by our on-site engineers.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {equipmentGrid.map((item, index) => (
          <EquipmentTile
            key={item.name}
            item={item}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex((prev) => (prev === index ? null : index))}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            key="equipment-modal"
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${equipmentGrid[expandedIndex].name} details`}
            onClick={() => setExpandedIndex(null)}
          >
            <motion.div
              className="glass-panel max-w-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={equipmentGrid[expandedIndex].image}
                alt={equipmentGrid[expandedIndex].name}
                width={800}
                height={600}
                className="h-56 w-full object-cover"
              />
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">{equipmentGrid[expandedIndex].name}</h3>
                  <p className="text-sm text-white/60">Included gear and accessories ready on standby for your session.</p>
                </div>
                <ul className="grid gap-2 text-sm text-white/80">
                  {equipmentGrid[expandedIndex].specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {spec}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end">
                  <button
                    onClick={() => setExpandedIndex(null)}
                    className="focus-ring rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface EquipmentTileProps {
  item: (typeof equipmentGrid)[number];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  prefersReducedMotion: boolean;
}

function EquipmentTile({ item, index, isExpanded, onToggle, prefersReducedMotion }: EquipmentTileProps) {
  const tilt = useTilt({ maxTiltX: 4, maxTiltY: 6 });
  const magnetic = useMagnetic({ strength: 0.08 });

  return (
    <motion.button
      type="button"
      className={cn(
        "glass-panel group relative overflow-hidden p-0 text-left",
        isExpanded ? "border-primary/40 shadow-neon" : "border-white/10"
      )}
      onClick={onToggle}
      ref={tilt.ref as RefObject<HTMLButtonElement>}
      style={prefersReducedMotion ? undefined : tilt.style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60" />
        <div className="absolute bottom-4 left-4 text-sm text-white/80">Tap to expand</div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <p className="text-xs uppercase tracking-widest text-white/50">
            {item.specs.slice(0, 2).join(" • ")} +
          </p>
        </div>
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-primary transition-transform group-hover:scale-110"
          onPointerMove={magnetic.onPointerMove}
          onPointerLeave={magnetic.onPointerLeave}
          ref={magnetic.ref as RefObject<HTMLSpanElement>}
          style={magnetic.style}
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
    </motion.button>
  );
}
