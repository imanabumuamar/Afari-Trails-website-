import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { hospitalityPhilosophy } from "@/lib/data/hospitality";

export function HospitalityPhilosophy() {
  return (
    <section id="philosophy" className="scroll-mt-24 bg-ivory py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-7">
          <SectionLabel>{hospitalityPhilosophy.label}</SectionLabel>
          <p className="mt-8 font-serif text-3xl font-light leading-[1.25] text-charcoal sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.2]">
            {hospitalityPhilosophy.statement}
          </p>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2">
            {hospitalityPhilosophy.themes.map((theme) => (
              <li
                key={theme}
                className="text-sm leading-relaxed text-charcoal/60"
              >
                {theme}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/10 lg:col-span-5">
          <Image
            src="https://images.unsplash.com/photo-1540541338287-417e03dee08f?w=1200&q=85"
            alt="Riverside lodge deck at golden hour"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
