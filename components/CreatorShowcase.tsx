"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";

import { featuredStories } from "@/lib/data";

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

  const handleEnter = () => {
    if (prefersReducedMotion) return;
    void audioRef.current?.play().catch(() => {
      /* noop */
    });
  };

  const handleLeave = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <article
      className="group relative overflow-hidden rounded-[32px] border border-border bg-surface"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
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
        <span>{story.tagline}</span>
        <span className="text-xs uppercase tracking-[0.3em] text-primary">Play preview</span>
      </div>
      <audio ref={audioRef} src={story.previewUrl} preload="metadata" />
    </article>
  );
}

export default CreatorShowcase;
