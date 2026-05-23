import { SectionLabel } from "@/components/ui/SectionLabel";
import { ecoLodgeConcept } from "@/lib/data/eco-lodge";

export function EcoLodgeConcept() {
  return (
    <section id="concept" className="scroll-mt-24 bg-ivory py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-2 lg:items-start lg:gap-20 lg:px-10">
        <div>
          <SectionLabel>{ecoLodgeConcept.label}</SectionLabel>
          <p className="font-serif text-3xl font-light leading-snug text-charcoal md:text-4xl lg:text-[2.65rem] lg:leading-[1.2]">
            {ecoLodgeConcept.statement}
          </p>
        </div>
        <div className="border-t border-charcoal/10 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
          <p className="text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {ecoLodgeConcept.body}
          </p>
        </div>
      </div>
    </section>
  );
}
