"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { HelpCircle, Search, X } from "lucide-react";

const faqs = [
  {
    question: "What equipment is included?",
    answer: "Every session arrives set with broadcast microphones, multi-cam capture, in-room comms, and real-time monitoring. If you need something specific, the concierge will source it before you arrive.",
  },
  {
    question: "Can I bring my own microphone?",
    answer: "Absolutely. We simply run it through our gain staging and return it before you leave. Let us know in advance so we can pre-patch the chain.",
  },
  {
    question: "Is there parking?",
    answer: "Valet pickup is available on Residency Road. Self-parking can be reserved in the private basement with 24-hour security.",
  },
  {
    question: "How do I receive my files?",
    answer: "We deliver a secure download link within 12 hours—multitrack audio, ISO visuals, live switch, and camera-original files. We can also deliver directly to your editor or cloud workspace.",
  },
];

export function FAQDrawer() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return faqs;
    return faqs.filter((faq) => faq.question.toLowerCase().includes(normalized) || faq.answer.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "?".toLowerCase()) {
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="fixed left-6 bottom-[88px] z-50 md:bottom-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="focus-ring flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 text-text-muted transition hover:text-text-primary"
        aria-expanded={open}
        aria-label="Open FAQs"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="card-panel absolute bottom-16 left-0 flex w-[320px] flex-col gap-4 overflow-hidden rounded-[28px] border border-border bg-background/95 p-6 text-text-primary backdrop-blur"
            role="dialog"
            aria-label="Frequently asked questions"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.4em] text-text-muted">FAQ</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-muted transition hover:text-text-primary"
                aria-label="Close FAQs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-text-muted">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none"
              />
            </label>
            <div className="space-y-4 text-sm text-text-muted">
              {filteredFaqs.map((faq) => (
                <details key={faq.question} className="group">
                  <summary className="cursor-pointer text-text-primary transition group-open:text-primary">
                    {faq.question}
                  </summary>
                  <p className="mt-2 leading-relaxed text-text-muted">{faq.answer}</p>
                </details>
              ))}
              {filteredFaqs.length === 0 && <p className="text-xs uppercase tracking-[0.3em] text-text-muted/60">No results—ask the concierge directly.</p>}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FAQDrawer;
