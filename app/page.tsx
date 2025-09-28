import dynamic from "next/dynamic";
import { Suspense } from "react";

import { AnalyticsInitializer } from "@/components/AnalyticsInitializer";
import { BookingProvider } from "@/components/BookingContext";
import { FloatingCTA } from "@/components/FloatingCTA";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Services } from "@/components/Services";
import { Showcase } from "@/components/Showcase";
import { BookingModal } from "@/components/BookingModal";
import { Footer } from "@/components/Footer";

const AvailabilitySection = dynamic(() => import("@/components/AvailabilitySection"), {
  loading: () => <SectionPlaceholder title="Live availability" />,
  ssr: false,
});

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  loading: () => <SectionPlaceholder title="Contact" />,
});

export default function Page() {
  return (
    <BookingProvider>
      <div className="relative min-h-screen bg-black text-white">
        <Suspense fallback={null}>
          <AnalyticsInitializer />
        </Suspense>
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Showcase />
          <Suspense fallback={<SectionPlaceholder title="Availability" />}>
            <AvailabilitySection />
          </Suspense>
          <Suspense fallback={<SectionPlaceholder title="Contact" />}>
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
        <FloatingCTA />
        <BookingModal />
      </div>
    </BookingProvider>
  );
}

function SectionPlaceholder({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-white/40">
      <div className="glass-panel h-48 animate-pulse bg-white/5 p-8">
        Loading {title}…
      </div>
    </section>
  );
}
