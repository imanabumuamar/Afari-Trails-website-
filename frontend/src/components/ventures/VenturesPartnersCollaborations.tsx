import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  isVenturesPartnersCollaborationsVisible,
  resolveVenturesPartnersCollaborations,
} from "@/lib/ventures/ventures-partners-shared";
import { getVenturePageContent } from "@/services/content/ventures";

function PartnerLogoCell({
  name,
  logo,
  href,
}: {
  name: string;
  logo?: string;
  href?: string;
}) {
  const inner = (
    <div className="flex aspect-[5/3] w-full items-center justify-center px-6 py-8 transition-all duration-300 group-hover:border-charcoal/25 group-hover:bg-sand-light/20">
      {logo ? (
        <div className="relative h-10 w-full max-w-[140px] sm:h-12">
          <Image
            src={logo}
            alt={name}
            fill
            className="object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 640px) 40vw, 140px"
          />
        </div>
      ) : (
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-charcoal/40 transition-colors duration-300 group-hover:text-charcoal/60">
          {name}
        </span>
      )}
    </div>
  );

  const className =
    "group overflow-hidden rounded-sm border border-charcoal/10 bg-ivory transition-all duration-300 hover:border-charcoal/20 hover:shadow-[0_8px_30px_rgba(28,28,28,0.06)]";

  if (href?.trim()) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}

export async function VenturesPartnersCollaborations() {
  const content = await getVenturePageContent("main");
  const section = resolveVenturesPartnersCollaborations(content);

  if (!isVenturesPartnersCollaborationsVisible(section)) return null;

  return (
    <section
      id="partners-collaborations"
      className="scroll-mt-24 bg-ivory py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Collaboration</SectionLabel>
          <h2 className="font-serif text-3xl font-light text-charcoal md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {section.heading}
          </h2>
          <p className="mt-6 text-sm leading-[1.9] text-charcoal/65 md:text-base">
            {section.description}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {section.partners.map((partner) => (
            <PartnerLogoCell
              key={partner.id}
              name={partner.name}
              logo={partner.logo}
              href={partner.href}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href={section.ctaHref}
            className="inline-block border border-charcoal/35 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal/[0.03]"
          >
            {section.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
