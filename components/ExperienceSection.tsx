import { processSteps } from "@/lib/data";

export function ExperienceSection() {
  return (
    <section id="experience" className="bg-elevated py-24">
      <div className="section-wrapper space-y-10">
        <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
          <div>
            <span className="tagline">Experience</span>
            <h2 className="mt-2 text-3xl font-semibold text-contrast sm:text-4xl">Every recording feels effortless.</h2>
          </div>
          <p className="text-sm text-muted">
            A producer-led team choreographs each session—from the first storyboard call to the final delivery link—so your focus stays on
            the conversation.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.number} className="rounded-3xl border border-border bg-background px-6 py-8">
              <span className="text-xs uppercase tracking-[0.4em] text-muted">{step.number}</span>
              <h3 className="mt-4 text-lg font-semibold text-contrast">{step.title}</h3>
              <p className="mt-4 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
