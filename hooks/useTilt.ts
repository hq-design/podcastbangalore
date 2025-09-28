import { useCallback, useMemo, useRef, useState } from "react";

interface TiltOptions {
  maxTiltX?: number;
  maxTiltY?: number;
  perspective?: number;
  scale?: number;
}

type TiltBind = {
  ref: React.RefObject<HTMLElement>;
  style: React.CSSProperties;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
};

export function useTilt(options: TiltOptions = {}): TiltBind {
  const {
    maxTiltX = 6,
    maxTiltY = 8,
    perspective = 900,
    scale = 1.03,
  } = options;

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const ref = useRef<HTMLElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
  });

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - relativeY) * maxTiltX * 2;
      const tiltY = (relativeX - 0.5) * maxTiltY * 2;
      setStyle({
        transform: `perspective(${perspective}px) rotateX(${tiltX.toFixed(
          2
        )}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${scale})`,
      });
    },
    [maxTiltX, maxTiltY, perspective, prefersReducedMotion, scale]
  );

  const onPointerLeave = useCallback(() => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    });
  }, [perspective]);

  return { ref, style, onPointerMove, onPointerLeave };
}
