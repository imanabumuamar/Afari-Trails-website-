import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionDetailHeroProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionDetailHero({ expedition }: ExpeditionDetailHeroProps) {
  return (
    <section className="relative min-h-screen">
      <Image
        src={expedition.heroImage}
        alt={expedition.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/80 via-matte-black/45 to-matte-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent to-matte-black/35" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-end px-6 pt-28 pb-20 lg:px-10 lg:pb-24">
        <div className="max-w-3xl animate-fade-in">
          <SectionLabel light>Expedition</SectionLabel>
          <h1 className="font-serif text-[2.25rem] font-light leading-[1.1] tracking-wide text-ivory sm:text-5xl lg:text-[3.25rem]">
            {expedition.title}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-ivory/70">
            {expedition.tagline}
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-ivory/15 pt-8">
            {expedition.quickDetails.map((detail) => (
              <li
                key={detail}
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-sand"
              >
                {detail}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="#inquiry"
              className="inline-flex items-center justify-center border border-ivory/55 bg-transparent px-8 py-3.5 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
            >
              Begin Inquiry
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center justify-center bg-sand/90 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.24em] text-charcoal transition-colors hover:bg-sand-light"
            >
              View Gallery
            </a>
          </div>
        </div>

        <Link
          href={ROUTES.expeditionsAll}
          className="mt-16 inline-block text-[10px] uppercase tracking-[0.22em] text-ivory/45 transition-colors hover:text-ivory/80"
        >
          ← All expeditions
        </Link>
      </div>
    </section>
  );
}
