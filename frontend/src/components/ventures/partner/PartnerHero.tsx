import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { partnerHero as default_partnerHero } from "@/lib/data/partner";

export async function PartnerHero() {
  const content = await getVenturePageContent("connect");
  const partnerHero = content.partnerHero as typeof default_partnerHero;

  return (
    <section className="relative min-h-screen">
      <Image
        src={partnerHero.image}
        alt={partnerHero.imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/70 via-matte-black/35 to-matte-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/60 via-transparent to-matte-black/25" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pt-28 pb-24 lg:px-10 lg:pt-32">
        <div className="max-w-2xl animate-fade-in lg:max-w-3xl">
          <SectionLabel light>{partnerHero.label}</SectionLabel>
          <h1 className="font-serif text-[2.35rem] font-light leading-[1.12] tracking-wide text-ivory sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1]">
            {partnerHero.heading}
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-[1.85] text-ivory/75 md:text-base">
            {partnerHero.subheading}
          </p>
          <a
            href="#conversation"
            className="mt-12 inline-flex items-center justify-center border border-ivory/60 bg-transparent px-10 py-4 text-xs font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:border-ivory hover:bg-ivory/10"
          >
            {partnerHero.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
