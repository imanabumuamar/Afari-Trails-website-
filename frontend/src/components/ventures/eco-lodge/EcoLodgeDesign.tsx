import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ecoLodgeDesign } from "@/lib/data/eco-lodge";

export function EcoLodgeDesign() {
  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <SectionLabel>{ecoLodgeDesign.label}</SectionLabel>
            <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
              {ecoLodgeDesign.heading}
            </h2>
            <p className="mt-8 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
              {ecoLodgeDesign.body}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {ecoLodgeDesign.moodboard.map((frame) => (
              <div
                key={frame.src}
                className="hover-zoom relative aspect-[4/5] overflow-hidden bg-charcoal/10"
              >
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
