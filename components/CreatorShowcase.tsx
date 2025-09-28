"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Pause, Play } from "lucide-react";

import { featuredStories } from "@/lib/data";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export function CreatorShowcase() {
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <section id="stories" className="mx-auto max-w-6xl px-6 py-24 text-text-primary">
      <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-text-muted">Stories</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Voices that shape the country record here.
          </h2>
        </div>
        <p className="max-w-md text-sm text-text-muted">
          Each project is a private session. These creators let us share a glimpse of what&apos;s possible when the room, the light, and the team disappear into the moment.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {featuredStories.map((story) => (
          <StoryCard key={story.title} story={story} prefersReducedMotion={prefersReducedMotion} />
        ))}
      </div>
    </section>
  );
}

interface StoryCardProps {
  story: (typeof featuredStories)[number];
  prefersReducedMotion: boolean;
}

function StoryCard({ story, prefersReducedMotion }: StoryCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.currentTime >= 30) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const stopPreview = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      stopPreview();
      return;
    }
    audio.currentTime = 0;
    void audio
      .play()
      .then(() => {
        if (prefersReducedMotion) {
          audio.pause();
          audio.currentTime = 0;
          return;
        }
        setIsPlaying(true);
        trackEvent(ANALYTICS_EVENTS.AUDIO_SAMPLE_PLAYED, {
          title: story.title,
        });
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  return (
    <article
      className="group relative overflow-hidden rounded-[32px] border border-border bg-surface"
      onMouseLeave={stopPreview}
      onBlur={stopPreview}
      tabIndex={0}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 768px) 33vw, 90vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-y-2 px-6 pb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-text-muted">{story.category}</p>
          <h3 className="font-display text-2xl text-text-primary">{story.title}</h3>
          <p className="text-sm text-text-muted">{story.host}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-4 text-sm text-text-muted">
        <div className="space-y-1">
          <span>{story.tagline}</span>
          <div className="text-xs uppercase tracking-[0.3em] text-text-muted/70">
            {story.episodes} episodes • {story.cadence}
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={handlePlayToggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-text-primary transition hover:border-primary hover:text-primary"
            aria-pressed={isPlaying}
            aria-label={isPlaying ? `Pause preview for ${story.title}` : `Play preview for ${story.title}`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <span className="pointer-events-none absolute left-1/2 top-[120%] -translate-x-1/2 rounded-full border border-border bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-text-muted opacity-0 transition group-hover:opacity-100">
            {story.since}
          </span>
        </div>
      </div>
      <div className="px-6 pb-6 text-sm italic text-text-muted">{story.testimonial}</div>
      <audio ref={audioRef} src={story.previewUrl} preload="metadata" />
    </article>
  );
}

export default CreatorShowcase;
