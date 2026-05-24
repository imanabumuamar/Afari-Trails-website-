import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeLocation as default_ecoLodgeLocation } from "@/lib/data/eco-lodge";

export async function EcoLodgeLocation() {
  const content = await getVenturePageContent("eco-lodge");
  const ecoLodgeLocation = content.ecoLodgeLocation as typeof default_ecoLodgeLocation;

  return (
    <section className="grid lg:grid-cols-2">
      <div className="relative min-h-[360px] lg:min-h-[560px]">
        <Image
          src={ecoLodgeLocation.image}
          alt={ecoLodgeLocation.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col justify-center bg-ivory px-6 py-20 lg:px-14 lg:py-28">
        <SectionLabel>{ecoLodgeLocation.label}</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {ecoLodgeLocation.heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
          {ecoLodgeLocation.body}
        </p>
      </div>
    </section>
  );
}
