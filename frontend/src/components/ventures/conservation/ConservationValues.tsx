import { SectionLabel } from "@/components/ui/SectionLabel";
import { conservationValues } from "@/lib/data/conservation";

export function ConservationValues() {
  return (
    <section className="border-y border-charcoal/10 bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>{conservationValues.label}</SectionLabel>
        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {conservationValues.principles.map((principle) => (
            <div key={principle.title}>
              <h3 className="font-serif text-xl font-light text-charcoal lg:text-2xl">
                {principle.title}
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-charcoal/55 md:text-sm">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
