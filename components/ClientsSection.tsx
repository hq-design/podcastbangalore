import { clientLogos } from "@/lib/data";

export function ClientsSection() {
  return (
    <section className="bg-elevated py-20">
      <div className="section-wrapper space-y-8">
        <span className="tagline">Creators & brands</span>
        <div className="grid grid-cols-2 gap-6 text-sm uppercase tracking-[0.3em] text-muted sm:grid-cols-4 lg:grid-cols-8">
          {clientLogos.map((client) => (
            <span key={client} className="text-center text-muted/80">
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientsSection;
