export function ShowreelSection() {
  return (
    <section id="showreel" className="bg-elevated py-24">
      <div className="section-wrapper space-y-6">
        <div className="flex flex-col gap-3">
          <span className="tagline">Showreel</span>
          <h2 className="text-3xl font-semibold text-contrast sm:text-4xl">Take a look inside the session.</h2>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-walking-through-the-studio-1577283353?download=1"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
}

export default ShowreelSection;
