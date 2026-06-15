"use client";

import Image from "next/image";
import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { isExpeditionContentItemVisible } from "@/lib/expeditions/expedition-content-item-status";
import {
  resolveItineraryDayLabel,
  resolveSectionCopy,
} from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionItineraryProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionItinerary({ expedition }: ExpeditionItineraryProps) {
  const sections = resolveSectionCopy(expedition);
  const days = expedition.itinerary.filter(isExpeditionContentItemVisible);

  if (days.length === 0) return null;

  return (
    <section id="itinerary" className="scroll-mt-24 bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <ExpeditionEyebrow>{sections.itineraryLabel}</ExpeditionEyebrow>
            <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
              {sections.itineraryHeading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
              {sections.itinerarySubtext}
            </p>
          </div>
          <a
            href="#inquiry"
            className="shrink-0 border border-charcoal/20 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal"
          >
            {sections.itineraryCtaLabel}
          </a>
        </div>

        <div className="mt-12 flex gap-5 overflow-x-auto pb-4 lg:mt-16 lg:gap-6">
          {days.map((day, index) => {
            const stripFrames = expedition.visualStrip.filter((frame) =>
              frame.src?.trim(),
            );
            const image =
              day.image ||
              stripFrames[index % Math.max(stripFrames.length, 1)]?.src ||
              expedition.heroImage;

            return (
              <article
                key={`${day.day}-${index}`}
                className="w-[min(300px,78vw)] shrink-0 border border-charcoal/10 bg-ivory"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/5">
                  <Image
                    src={image}
                    alt={day.imageAlt || day.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-muted">
                    {resolveItineraryDayLabel(day)}
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-light text-charcoal">
                    {day.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                    {day.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
