import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function BrandStatement() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12">
        <div className="lg:pr-8">
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal md:text-5xl lg:text-[3.25rem]">
            Born between cultures, landscapes, and journeys
          </h2>
          <p className="mt-8 text-base leading-relaxed text-charcoal/75 md:text-lg">
            Afari Trails was born between cultures, landscapes, and journeys —
            inspired by Africa&apos;s untamed spirit and the human search for
            belonging. We curate experiences that honor the land, elevate local
            communities, and invite travelers to walk paths that change them.
          </p>
          <p className="mt-6 text-base leading-relaxed text-charcoal/60">
            From the Zambezi to the savanna, every expedition is an invitation to
            move slower, see deeper, and return transformed.
          </p>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1547471080-7cc2caa12f7f?w=1200&q=85"
            alt="Safari expedition through African wilderness"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
