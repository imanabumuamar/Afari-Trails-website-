"use client";

import Image from "next/image";
import { buildWhatsAppHref } from "@/config/whatsapp";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionDetailFooterCtaProps = {
  expedition: ExpeditionDetail;
  whatsappNumber?: string;
};

export function ExpeditionDetailFooterCta({
  expedition,
  whatsappNumber = "",
}: ExpeditionDetailFooterCtaProps) {
  const sections = resolveSectionCopy(expedition);
  const wa = whatsappNumber
    ? buildWhatsAppHref(
        whatsappNumber,
        `Hello Afari Trails — I'm interested in ${expedition.title}.`,
      )
    : null;

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <Image
        src={expedition.heroImage}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/78" />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
        <h2 className="font-serif text-3xl font-light text-ivory md:text-4xl lg:text-5xl">
          {sections.footerCtaHeading}
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#inquiry"
            className="inline-flex items-center justify-center bg-safari-green px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-safari-green-deep"
          >
            {sections.enquireLabel}
          </a>
          {expedition.brochureUrl && (
            <a
              href={expedition.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-ivory/40 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
            >
              {sections.brochureLabel}
            </a>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-ivory/40 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
            >
              {sections.whatsappLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
