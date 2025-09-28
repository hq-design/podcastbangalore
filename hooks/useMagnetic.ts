import { useCallback, useMemo, useRef, useState } from "react";

interface Options {
  strength?: number;
}

type MagneticBind = {
  ref: React.RefObject<HTMLElement>;
  style: React.CSSProperties;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
};

export function useMagnetic(options: Options = {}): MagneticBind {
  const { strength = 0.2 } = options;
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const ref = useRef<HTMLElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "translate3d(0, 0, 0)",
  });

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) {
        return;
      }
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);
      setStyle({
        transform: `translate3d(${offsetX * strength}px, ${offsetY * strength}px, 0)`,
      });
    },
    [prefersReducedMotion, strength]
  );

  const onPointerLeave = useCallback(() => {
    setStyle({ transform: "translate3d(0, 0, 0)" });
  }, []);

  return { ref, style, onPointerMove, onPointerLeave };
}
