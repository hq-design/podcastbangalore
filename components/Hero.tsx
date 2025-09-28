import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1920&q=80";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="section-wrapper relative flex min-h-[80vh] flex-col justify-center gap-12 py-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="tagline">Bengaluru • Podcast Studio</span>
            <h1 className="font-sans text-4xl font-semibold leading-tight text-contrast sm:text-5xl lg:text-[3.5rem]">
              Where Bengaluru’s conversations take stage.
            </h1>
            <p className="max-w-xl text-base text-muted lg:text-lg">
              Podcast Bangalore is a modern recording house where creators, founders, and storytellers shape ideas with cinema-grade
              sound, lighting, and hospitality.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#contact"
                className="rounded-full bg-contrast px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-background"
              >
                Book a studio tour
              </Link>
              <Link href="#showreel" className="text-xs uppercase tracking-[0.3em] text-contrast">
                Watch showreel →
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-6 pt-6 text-sm text-muted sm:grid-cols-3">
              <div>
                <dt className="tagline">Podcasts recorded</dt>
                <dd className="text-2xl font-semibold text-contrast">500+</dd>
              </div>
              <div>
                <dt className="tagline">Average rating</dt>
                <dd className="text-2xl font-semibold text-contrast">4.9/5</dd>
              </div>
              <div>
                <dt className="tagline">Turnaround</dt>
                <dd className="text-2xl font-semibold text-contrast">24 hrs</dd>
              </div>
            </dl>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
            <Image src={HERO_IMAGE} alt="Podcast Bangalore studio" fill className="object-cover" priority />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
