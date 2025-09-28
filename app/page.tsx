import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import StudiosSection from "@/components/StudiosSection";
import ExperienceSection from "@/components/ExperienceSection";
import ServicesSection from "@/components/ServicesSection";
import ShowreelSection from "@/components/ShowreelSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ClientsSection from "@/components/ClientsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="bg-background text-contrast">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <StudiosSection />
        <ExperienceSection />
        <ServicesSection />
        <ShowreelSection />
        <TestimonialsSection />
        <ClientsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
