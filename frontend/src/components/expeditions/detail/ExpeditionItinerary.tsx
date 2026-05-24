"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionItineraryProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionItinerary({ expedition }: ExpeditionItineraryProps) {
  const items = expedition.itinerary.map((day) => ({
    id: `day-${day.day}`,
    title: `Day ${day.day} — ${day.title}`,
    content: day.description,
  }));

  return (
    <section id="itinerary" className="scroll-mt-24 bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>The Journey</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            Itinerary
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/60">
            A rhythm of days — atmospheric, unhurried, and open to the unexpected.
          </p>
        </div>
        <div className="mt-14 lg:mt-20">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
