const TOUR_URL = "https://momento360.com/e/u/placeholder";

function VirtualTour() {
  return (
    <section id="tour" className="mx-auto max-w-6xl px-6 py-24 text-white">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="text-sm uppercase tracking-widest text-primary">Immersive tour</span>
          <h2 className="font-display text-4xl">Take a 360° look around the studio.</h2>
          <p className="max-w-2xl text-lg text-white/70">
            Explore our control room, live stage, and lounge using the interactive tour. Hotspots highlight equipment callouts and acoustic treatments.
          </p>
        </div>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <iframe
          src={TOUR_URL}
          className="h-full w-full"
          loading="lazy"
          allowFullScreen
          title="Virtual studio tour"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-sm text-white/60">
          Provide your own 360° experience URL to replace this placeholder embed.
        </div>
      </div>
    </section>
  );
}

export { VirtualTour };
export default VirtualTour;
