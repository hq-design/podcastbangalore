import { AudioAB } from "@/components/AudioAB";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";

export function Showcase() {
  return (
    <section
      id="studio-story"
      className="relative mx-auto max-w-6xl space-y-16 px-6 py-24"
    >
      <div className="absolute inset-0 -z-10 rounded-[48px] bg-gradient-to-br from-primary/10 via-white/5 to-transparent" />
      <Gallery />
      <Testimonials />
      <AudioAB />
    </section>
  );
}
