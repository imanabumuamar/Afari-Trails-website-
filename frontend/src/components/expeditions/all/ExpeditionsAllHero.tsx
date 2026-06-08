import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import type { ExpeditionsAllPageContent } from "@/lib/data/expedition-defaults";

type ExpeditionsAllHeroProps = {
  content: ExpeditionsAllPageContent;
};

export function ExpeditionsAllHero({ content }: ExpeditionsAllHeroProps) {
  const { hero } = content;

  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh]">
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/75 via-matte-black/45 to-matte-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/65 via-transparent to-matte-black/30" />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end px-6 pt-28 pb-20 lg:min-h-[80vh] lg:px-10 lg:pb-24">
        <SectionLabel light>{hero.label}</SectionLabel>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-light leading-[1.1] text-ivory md:text-6xl lg:text-[3.5rem]">
          {hero.heading}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-[1.85] text-ivory/75 md:text-base">
          {hero.subtext}
        </p>
        <Link
          href={ROUTES.expeditions}
          className="mt-10 inline-block text-[10px] uppercase tracking-[0.22em] text-ivory/45 transition-colors hover:text-ivory/80"
        >
          {hero.backLabel}
        </Link>
      </div>
    </section>
  );
}
