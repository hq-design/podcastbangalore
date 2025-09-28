import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Options {
  bars?: number;
  speed?: number;
  smoothing?: number;
}

export function useAudioViz({ bars = 28, speed = 0.18, smoothing = 0.65 }: Options = {}) {
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [isActive, setIsActive] = useState(!prefersReducedMotion);
  const valuesRef = useRef<number[]>(Array.from({ length: bars }, () => Math.random()));
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;
    let frame = 0;

    const animate = () => {
      const values = valuesRef.current.map((value, index) => {
        const noise = Math.sin(Date.now() * speed * 0.001 + index) * 0.5 + 0.5;
        const sample = Math.random() * 0.7 + noise * 0.3;
        return value * smoothing + sample * (1 - smoothing);
      });
      valuesRef.current = values;
      setTick((tick) => (tick + 1) % 1000);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isActive, prefersReducedMotion, speed, smoothing]);

  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);

  return {
    values: valuesRef.current,
    isActive,
    start,
    stop,
  };
}
