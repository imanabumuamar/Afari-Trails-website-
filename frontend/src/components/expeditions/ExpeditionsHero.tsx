import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { expeditionsHero } from "@/lib/data/expeditions";

export function ExpeditionsHero() {
  return (
    <section className="relative min-h-[88vh] lg:min-h-screen">
      <Image
        src={expeditionsHero.image}
        alt="Safari vehicle on the savanna at sunset with elephants in the distance"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/70 via-matte-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/55 via-transparent to-matte-black/20" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-end px-6 pb-24 pt-32 lg:min-h-screen lg:px-10 lg:pb-32 lg:pt-36">
        <h1 className="max-w-2xl font-serif text-5xl font-light leading-[1.1] text-ivory sm:text-6xl lg:text-[4.5rem]">
          {expeditionsHero.heading}
        </h1>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/75 md:text-base">
          {expeditionsHero.subtext}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button href="#featured" variant="sand">
            Explore Expeditions
          </Button>
          <Button href="/contact" variant="text" showArrow>
            Plan Your Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
