"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pb:high-contrast";

export function HighContrastToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setEnabled(true);
        document.documentElement.classList.add("high-contrast");
      }
    } catch (error) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch (error) {
      /* ignore */
    }
  }, [enabled]);

  return (
    <button
      type="button"
      onClick={() => setEnabled((prev) => !prev)}
      className="text-[10px] uppercase tracking-[0.3em] text-text-muted transition hover:text-text-primary"
    >
      High contrast {enabled ? "on" : "off"}
    </button>
  );
}

export default HighContrastToggle;
