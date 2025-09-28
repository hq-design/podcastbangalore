import { AudioAB } from "@/components/AudioAB";
import { EquipmentGrid } from "@/components/EquipmentGrid";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";

export function Showcase() {
  return (
    <section id="studio" className="mx-auto max-w-6xl space-y-16 px-6 py-24">
      <Gallery />
      <EquipmentGrid />
      <Testimonials />
      <AudioAB />
    </section>
  );
}
