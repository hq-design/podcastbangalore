"use client";

import { useEffect, useRef, useState } from "react";
import { AudioWaveform } from "lucide-react";

import { useAudioViz } from "@/hooks/useAudioViz";
import { cn } from "@/lib/utils";

const samples = {
  raw: {
    label: "Raw Room",
    description: "Captured without treatment",
    src: "https://cdn.pixabay.com/download/audio/2022/10/24/audio_805efdd4eb.mp3?filename=ambient-piano-124008.mp3",
  },
  mix: {
    label: "Our Studio Mix",
    description: "Mixed + mastered in post",
    src: "https://cdn.pixabay.com/download/audio/2022/03/23/audio_ee2c610111.mp3?filename=ambient-110582.mp3",
  },
};

type SampleKey = keyof typeof samples;

export function AudioAB() {
  const [active, setActive] = useState<SampleKey>("raw");
  const playerRef = useRef<HTMLAudioElement>(null);
  const visualizer = useAudioViz({ bars: 32, speed: 0.22, smoothing: 0.6 });

  useEffect(() => {
    playerRef.current?.pause();
  }, [active]);

  const handlePlay = () => visualizer.start();
  const handlePause = () => visualizer.stop();

  return (
    <section className="glass-panel space-y-6 p-8" aria-labelledby="audio-ab-heading">
      <div className="flex flex-col gap-4 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-sm uppercase tracking-widest text-primary">Hear the difference</span>
          <h3 id="audio-ab-heading" className="font-display text-2xl">
            Before & after: acoustic treatment in action.
          </h3>
        </div>
        <p className="max-w-xl text-sm text-white/60">
          Toggle between untreated room capture and our engineered mix. Headphones recommended for the full effect.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {(Object.keys(samples) as SampleKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              active === key
                ? "border-primary bg-primary/20 text-white"
                : "border-white/20 bg-white/5 text-white/70 hover:text-white"
            )}
            type="button"
            aria-pressed={active === key}
          >
            {samples[key].label}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-white/70">
            <AudioWaveform className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-white">{samples[active].label}</div>
              <div>{samples[active].description}</div>
            </div>
          </div>
        </div>
        <div className="relative h-24 overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent-blue/20">
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
            {visualizer.values.map((value, index) => (
              <span
                key={index}
                className="w-1.5 rounded-t-full bg-gradient-to-t from-primary via-accent-blue to-accent-green/80"
                style={{ height: `${Math.max(12, value * 120)}px` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        <audio
          key={active}
          ref={playerRef}
          src={samples[active].src}
          preload="none"
          controls
          className="w-full"
          onPlay={handlePlay}
          onPause={handlePause}
        />
        <p className="text-xs text-white/40">
          Audio samples are illustrative placeholders. Provide final stems for precise A/B comparison.
        </p>
      </div>
    </section>
  );
}
