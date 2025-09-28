import dynamic from "next/dynamic";
import { Suspense } from "react";

import { AnalyticsInitializer } from "@/components/AnalyticsInitializer";
import { BookingProvider } from "@/components/BookingContext";
import { BookingModal } from "@/components/BookingModal";
import { BookingSection } from "@/components/BookingSection";
import { CreatorShowcase } from "@/components/CreatorShowcase";
import { CreatorsStatement } from "@/components/CreatorsStatement";
import { FAQDrawer } from "@/components/FAQDrawer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MobileNavBar } from "@/components/MobileNavBar";
import { Navbar } from "@/components/Navbar";
import { PowerUserMenu } from "@/components/PowerUserMenu";
import { SpaceSection } from "@/components/SpaceSection";

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  loading: () => <SectionPlaceholder title="Contact" />,
});

export default function Page() {
  return (
    <BookingProvider>
      <div className="relative min-h-screen bg-background text-text-primary">
        <Suspense fallback={null}>
          <AnalyticsInitializer />
        </Suspense>
        <Navbar />
        <main>
          <Hero />
          <CreatorShowcase />
          <CreatorsStatement />
          <SpaceSection />
          <BookingSection />
          <Suspense fallback={<SectionPlaceholder title="Contact" />}>
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
        <FloatingCTA />
        <FAQDrawer />
        <PowerUserMenu />
        <MobileNavBar />
        <BookingModal />
      </div>
    </BookingProvider>
  );
}

function SectionPlaceholder({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-text-muted/50">
      <div className="card-panel h-48 animate-pulse bg-surface p-8">
        Loading {title}…
      </div>
    </section>
  );
}
