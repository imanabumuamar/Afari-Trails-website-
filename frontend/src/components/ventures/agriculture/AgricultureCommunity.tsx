import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { agricultureCommunity } from "@/lib/data/agriculture";

export function AgricultureCommunity() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-ivory px-6 py-20 lg:px-14 lg:py-28">
        <SectionLabel>{agricultureCommunity.label}</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {agricultureCommunity.heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
          {agricultureCommunity.body}
        </p>
      </div>
      <div className="relative min-h-[360px] lg:min-h-[560px]">
        <Image
          src={agricultureCommunity.image}
          alt={agricultureCommunity.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
