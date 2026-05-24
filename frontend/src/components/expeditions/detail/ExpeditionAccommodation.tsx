import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionAccommodationProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionAccommodation({
  expedition,
}: ExpeditionAccommodationProps) {
  const { accommodation } = expedition;

  return (
    <section className="bg-beige py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="relative aspect-[4/5] w-full overflow-hidden lg:order-2">
          <Image
            src={accommodation.image}
            alt={accommodation.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="lg:order-1 lg:py-8">
          <SectionLabel>Where You Rest</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {accommodation.heading}
          </h2>
          <p className="mt-8 max-w-lg text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {accommodation.body}
          </p>
        </div>
      </div>
    </section>
  );
}
