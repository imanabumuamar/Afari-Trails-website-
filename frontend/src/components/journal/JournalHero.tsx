import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { JournalPageContent } from "@/types/journal-content";

type JournalHeroProps = {
  hero: JournalPageContent["hero"];
};

export function JournalHero({ hero }: JournalHeroProps) {
  return (
    <section className="relative min-h-[72vh] pt-28 lg:min-h-[80vh]">
      <Image
        src={hero.image}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/55" />
      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-[1400px] flex-col justify-end px-6 pb-20 lg:min-h-[80vh] lg:px-10 lg:pb-28">
        <SectionLabel light>{hero.label}</SectionLabel>
        <h1 className="mt-4 font-serif text-5xl font-light text-ivory sm:text-6xl lg:text-[4.5rem]">
          {hero.heading}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/75 md:text-base">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
