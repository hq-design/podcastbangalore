"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { galleryImages } from "@/lib/data";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { ref, isInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index === null ? index : (index + 1) % galleryImages.length));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index === null ? index : (index - 1 + galleryImages.length) % galleryImages.length));
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close]);

  return (
    <div ref={ref} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm uppercase tracking-widest text-primary">Studio showcase</span>
          <h2 className="font-display text-3xl text-white">Step inside the Ultimate Podcast Studio.</h2>
        </div>
        <p className="hidden max-w-sm text-sm text-white/60 lg:block">
          Explore cinematic stills from the control room, lounge, and live set. Tap a frame to open the lightbox and swipe through the full gallery.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {galleryImages.map((image, index) => (
          <motion.button
            type="button"
            key={image.src}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/5 bg-white/5"
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 600px, 90vw"
              className={cn(
                "h-full w-full object-cover transition-transform duration-500",
                isInView ? "scale-100" : "scale-105",
                "group-hover:scale-110"
              )}
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 max-w-xs text-left text-sm text-white/90">
              {image.caption}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery lightbox"
            onClick={close}
          >
            <motion.div
              className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={galleryImages[activeIndex].src}
                alt={galleryImages[activeIndex].alt}
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-6 text-sm text-white/80">
                <span>{galleryImages[activeIndex].caption}</span>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white/60">
                  <button onClick={close} className="focus-ring rounded-full px-3 py-1">
                    Close
                  </button>
                  <span>
                    {activeIndex + 1} / {galleryImages.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
