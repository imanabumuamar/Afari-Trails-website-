import Image from "next/image";
import Link from "next/link";
import type { ArchivePageContent } from "@/types/archive-content";

type ArchiveHeroProps = {
  hero: ArchivePageContent["hero"];
};

export function ArchiveHero({ hero }: ArchiveHeroProps) {
  return (
    <section className="relative flex min-h-screen items-center">
      <Image
        src={hero.image}
        alt="Elephant crossing at dawn on the African savanna"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/80 via-matte-black/50 to-matte-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-matte-black/25" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 lg:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-sand">
          {hero.label}
        </p>
        <h1 className="mt-6 max-w-2xl font-serif text-5xl font-light leading-[1.1] text-ivory sm:text-6xl lg:text-[4.25rem]">
          {hero.heading}
        </h1>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-ivory/65 md:text-base">
          {hero.description}
        </p>
        <Link
          href="#collections"
          className="mt-12 inline-flex items-center gap-2 border border-ivory/50 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
        >
          Explore Collections
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
