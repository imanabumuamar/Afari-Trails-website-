import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { hospitalityPhilosophy as default_hospitalityPhilosophy } from "@/lib/data/hospitality";

export async function HospitalityPhilosophy() {
  const content = await getVenturePageContent("hospitality");
  const hospitalityPhilosophy = content.hospitalityPhilosophy as typeof default_hospitalityPhilosophy;

  return (
    <section id="philosophy" className="scroll-mt-24 bg-sand pt-12 pb-8 lg:pt-16 lg:pb-10">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 lg:grid-cols-12 lg:items-stretch lg:gap-10 lg:px-10">
        <div className="flex flex-col justify-center lg:col-span-7">
          <SectionLabel>{hospitalityPhilosophy.label}</SectionLabel>
          <p className="mt-4 font-serif text-2xl font-light leading-[1.3] text-charcoal sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]">
            {hospitalityPhilosophy.statement}
          </p>
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {hospitalityPhilosophy.themes.map((theme) => (
              <li
                key={theme}
                className="text-xs leading-relaxed text-charcoal/60 sm:text-sm"
              >
                {theme}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand lg:col-span-5 lg:aspect-auto lg:h-full lg:min-h-0">
          <Image
            src={hospitalityPhilosophy.image ?? default_hospitalityPhilosophy.image}
            alt={
              hospitalityPhilosophy.imageAlt ??
              default_hospitalityPhilosophy.imageAlt
            }
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
