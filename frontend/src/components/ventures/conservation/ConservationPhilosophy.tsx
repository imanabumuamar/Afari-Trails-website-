import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { conservationPhilosophy as default_conservationPhilosophy } from "@/lib/data/conservation";

export async function ConservationPhilosophy() {
  const content = await getVenturePageContent("conservation");
  const conservationPhilosophy = content.conservationPhilosophy as typeof default_conservationPhilosophy;

  const themes =
    Array.isArray(conservationPhilosophy.themes) &&
    conservationPhilosophy.themes.length > 0
      ? conservationPhilosophy.themes
      : default_conservationPhilosophy.themes;

  const image =
    conservationPhilosophy.image?.trim() || default_conservationPhilosophy.image;
  const imageAlt =
    conservationPhilosophy.imageAlt?.trim() ||
    default_conservationPhilosophy.imageAlt;

  return (
    <section id="philosophy" className="scroll-mt-24 bg-sand-light pt-28 pb-16 lg:pt-40 lg:pb-20">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-7">
          <SectionLabel>{conservationPhilosophy.label}</SectionLabel>
          <p className="mt-8 font-serif text-3xl font-light leading-[1.25] text-charcoal sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.2]">
            {conservationPhilosophy.statement}
          </p>
          <ul className="mt-16 grid gap-6 border-t border-charcoal/10 pt-16 sm:grid-cols-2 lg:max-w-3xl lg:gap-8">
            {themes.map((theme) => (
              <li
                key={theme}
                className="text-sm leading-relaxed text-charcoal/60 md:text-base"
              >
                {theme}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/10 lg:col-span-5">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
