"use client";

import { motion } from "framer-motion";
import { type ComponentType, type RefObject, useState } from "react";
import { CalendarClock, Cpu, GaugeCircle, Mic2 } from "lucide-react";

import { services } from "@/lib/data";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  mic: Mic2,
  cpu: Cpu,
  gauge: GaugeCircle,
  calendar: CalendarClock,
};

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="services" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 flex flex-col gap-4 text-white">
        <span className="text-sm uppercase tracking-widest text-primary">What you get</span>
        <h2 className="font-display text-4xl leading-tight">Premium studio services engineered for creators.</h2>
        <p className="max-w-2xl text-lg text-white/70">
          Every booking includes concierge prep, world-class microphones, cinematic lighting, and a dedicated engineer. Hover or tap to uncover the details packed into each service pillar.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            service={service}
            isActive={activeIndex === index}
            onActivate={() => setActiveIndex(index)}
            onDeactivate={() => setActiveIndex(null)}
            onToggle={() => setActiveIndex((prev) => (prev === index ? null : index))}
          />
        ))}
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: (typeof services)[number];
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
}

function ServiceCard({ service, isActive, onActivate, onDeactivate, onToggle }: ServiceCardProps) {
  const tilt = useTilt({ maxTiltX: 5, maxTiltY: 6 });
  const Icon = iconMap[service.icon] ?? Mic2;

  return (
    <motion.article
      className={cn(
        "glass-panel relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden p-6 transition-all duration-300",
        isActive ? "border-primary/60 shadow-neon" : "border-white/10"
      )}
      onPointerEnter={onActivate}
      onPointerLeave={onDeactivate}
      onClick={onToggle}
      ref={tilt.ref as RefObject<HTMLDivElement>}
      style={tilt.style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-xl font-semibold text-white">{service.title}</h3>
      </div>
      <p className="text-sm text-white/70">{service.description}</p>
      <motion.div
        initial={false}
        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
        className="text-sm text-white/60"
      >
        {service.details}
      </motion.div>
    </motion.article>
  );
}
