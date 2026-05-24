import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import { getVenturePageContent } from "@/services/content/ventures";
import { communityHero as default_communityHero } from "@/lib/data/community";

export async function CommunityHero() {
  const content = await getVenturePageContent("community");
  const communityHero = content.communityHero as typeof default_communityHero;

  return (
    <section className="relative min-h-screen">
      <Image
        src={communityHero.image}
        alt={communityHero.imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/70 via-matte-black/40 to-matte-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/60 via-transparent to-matte-black/25" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pt-28 pb-24 lg:px-10">
        <div className="max-w-2xl animate-fade-in lg:max-w-3xl">
          <SectionLabel light>{communityHero.label}</SectionLabel>
          <h1 className="font-serif text-[2.35rem] font-light leading-[1.12] tracking-wide text-ivory sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {communityHero.heading}
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-[1.85] text-ivory/75 md:text-base">
            {communityHero.subheading}
          </p>
          <div className="mt-12 flex flex-wrap gap-5">
            <a
              href="#focus"
              className="inline-flex items-center justify-center border border-ivory/55 bg-transparent px-8 py-3.5 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
            >
              {communityHero.exploreCta}
            </a>
            <Link
              href={ROUTES.venturesPartner}
              className="inline-flex items-center justify-center bg-sand px-8 py-3.5 text-xs font-medium uppercase tracking-[0.24em] text-charcoal transition-colors hover:bg-sand-light"
            >
              {communityHero.partnerCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
