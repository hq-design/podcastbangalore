import { useEffect, useMemo, useState } from "react";

interface Options {
  start?: number;
  end?: number;
  triggerStart?: number;
  triggerEnd?: number;
}

type ScrollHue = {
  hue: number;
  style: React.CSSProperties;
};

export function useScrollHue({
  start = 0,
  end = 25,
  triggerStart = 0,
  triggerEnd = 0.6,
}: Options = {}): ScrollHue {
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [hue, setHue] = useState(start);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      const clamped = Math.min(Math.max((progress - triggerStart) / (triggerEnd - triggerStart), 0), 1);
      setHue(start + (end - start) * clamped);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [end, prefersReducedMotion, start, triggerEnd, triggerStart]);

  return {
    hue,
    style: prefersReducedMotion
      ? {}
      : {
          filter: `hue-rotate(${hue}deg)`,
          transition: "filter 0.4s ease-out",
        },
  };
}
