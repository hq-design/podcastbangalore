import { useEffect, useMemo, useRef, useState } from "react";

type Axis = "x" | "y";

interface Options {
  strength?: number;
  axis?: Axis;
}

type ParallaxBind = {
  ref: React.RefObject<HTMLElement>;
  style: React.CSSProperties;
};

export function useParallax({ strength = 0.25, axis = "y" }: Options = {}): ParallaxBind {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let frame = 0;

    const update = () => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const nodeCenter = rect.top + rect.height / 2;
      const distance = nodeCenter - viewportCenter;
      setOffset(-distance * strength * 0.15);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [prefersReducedMotion, strength]);

  const transform = axis === "y"
    ? `translate3d(0, ${offset.toFixed(2)}px, 0)`
    : `translate3d(${offset.toFixed(2)}px, 0, 0)`;

  return { ref, style: { transform } };
}
