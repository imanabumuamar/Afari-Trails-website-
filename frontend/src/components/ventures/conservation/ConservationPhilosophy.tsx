import { SectionLabel } from "@/components/ui/SectionLabel";
import { conservationPhilosophy } from "@/lib/data/conservation";

export function ConservationPhilosophy() {
  return (
    <section id="philosophy" className="scroll-mt-24 bg-ivory py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>{conservationPhilosophy.label}</SectionLabel>
        <p className="mt-8 max-w-4xl font-serif text-3xl font-light leading-[1.25] text-charcoal sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.2]">
          {conservationPhilosophy.statement}
        </p>
        <ul className="mt-16 grid gap-6 border-t border-charcoal/10 pt-16 sm:grid-cols-2 lg:max-w-3xl lg:gap-8">
          {conservationPhilosophy.themes.map((theme) => (
            <li
              key={theme}
              className="text-sm leading-relaxed text-charcoal/60 md:text-base"
            >
              {theme}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
