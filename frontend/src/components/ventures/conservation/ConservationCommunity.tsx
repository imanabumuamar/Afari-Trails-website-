import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { conservationCommunity as default_conservationCommunity } from "@/lib/data/conservation";

export async function ConservationCommunity() {
  const content = await getVenturePageContent("conservation");
  const conservationCommunity = content.conservationCommunity as typeof default_conservationCommunity;

  return (
    <section className="grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-ivory px-6 py-20 lg:order-2 lg:px-14 lg:py-28">
        <SectionLabel>{conservationCommunity.label}</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {conservationCommunity.heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
          {conservationCommunity.body}
        </p>
      </div>
      <div className="relative min-h-[360px] lg:order-1 lg:min-h-[560px]">
        <Image
          src={conservationCommunity.image}
          alt={conservationCommunity.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
