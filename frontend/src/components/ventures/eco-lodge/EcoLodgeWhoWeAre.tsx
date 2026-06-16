import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeWhoWeAre as default_ecoLodgeWhoWeAre } from "@/lib/data/eco-lodge";

export async function EcoLodgeWhoWeAre() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeWhoWeAre as typeof default_ecoLodgeWhoWeAre;
  const paragraphs = section.body.split("\n\n").filter(Boolean);
  const image = section.image || default_ecoLodgeWhoWeAre.image;
  const imageAlt = section.imageAlt || default_ecoLodgeWhoWeAre.imageAlt;

  return (
    <section id="who-we-are" className="scroll-mt-24 bg-sand pt-12 pb-8 lg:pt-16 lg:pb-10">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-12 lg:items-stretch lg:gap-12 lg:px-10">
        <div className="flex flex-col justify-center lg:col-span-7">
          <SectionLabel>{section.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal md:text-5xl lg:text-[3.25rem]">
            {section.heading}
          </h2>
          <div className="mt-8 space-y-5">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/10 lg:col-span-5 lg:aspect-auto lg:h-full lg:min-h-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
