import Image from "next/image";
import Link from "next/link";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeFinalCta as default_ecoLodgeFinalCta } from "@/lib/data/eco-lodge";

export async function EcoLodgeFinalCta() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeFinalCta as typeof default_ecoLodgeFinalCta;
  const paragraphs = section.body.split("\n\n").filter(Boolean);
  const ctaHref = section.ctaHref ?? "/ventures/connect";
  const secondaryHref = section.secondaryCtaHref ?? "/ventures/partner";

  return (
    <section className="relative min-h-[480px] lg:min-h-[540px]">
      <Image
        src={section.image}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/78" />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center justify-center px-6 py-24 text-center lg:px-10 lg:py-32">
        <h2 className="max-w-4xl font-serif text-3xl font-light leading-snug text-ivory md:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
          {section.heading}
        </h2>
        <div className="mt-8 max-w-2xl space-y-4">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-sm leading-relaxed text-ivory/70 md:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center border border-ivory/50 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
          >
            {section.cta} →
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center bg-sand px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:bg-sand-light"
          >
            {section.secondaryCta} →
          </Link>
        </div>
      </div>
    </section>
  );
}
