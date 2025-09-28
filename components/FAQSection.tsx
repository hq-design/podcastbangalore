import { faqItems } from "@/lib/data";

export function FAQSection() {
  return (
    <section id="faq" className="section-wrapper space-y-10 py-24">
      <div className="max-w-2xl space-y-3">
        <span className="tagline">FAQ</span>
        <h2 className="text-3xl font-semibold text-contrast sm:text-4xl">Everything you need to know.</h2>
      </div>
      <div className="space-y-4">
        {faqItems.map((item) => (
          <details key={item.question} className="group rounded-3xl border border-border bg-elevated px-6 py-5">
            <summary className="cursor-pointer text-base font-semibold text-contrast">
              {item.question}
            </summary>
            <p className="mt-3 text-sm text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default FAQSection;
