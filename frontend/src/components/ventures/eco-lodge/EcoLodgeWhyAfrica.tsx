import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeWhyAfrica as default_ecoLodgeWhyAfrica } from "@/lib/data/eco-lodge";

export async function EcoLodgeWhyAfrica() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeWhyAfrica as typeof default_ecoLodgeWhyAfrica;
  const paragraphs = section.body.split("\n\n").filter(Boolean);

  return (
    <section className="bg-sand-light py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-10">
        <div className="flex flex-col justify-center">
          <SectionLabel>{section.label}</SectionLabel>
          <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-charcoal md:text-[2.75rem]">
            {section.heading}
          </h2>
          <div className="mt-8 space-y-6">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-[1.85] text-charcoal/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-charcoal/10 lg:aspect-auto lg:h-full lg:min-h-0">
          <Image
            src={section.image}
            alt={section.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
