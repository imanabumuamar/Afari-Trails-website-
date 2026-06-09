"use client";

import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { Accordion } from "@/components/ui/Accordion";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionFaqProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionFaq({ expedition }: ExpeditionFaqProps) {
  if (expedition.faq.length === 0) return null;
  const sections = resolveSectionCopy(expedition);
  const midpoint = Math.ceil(expedition.faq.length / 2);
  const columns = [
    expedition.faq.slice(0, midpoint),
    expedition.faq.slice(midpoint),
  ].filter((col) => col.length > 0);

  return (
    <section className="bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ExpeditionEyebrow>{sections.faqLabel}</ExpeditionEyebrow>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {sections.faqHeading}
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {columns.map((col, colIndex) => (
            <Accordion
              key={colIndex}
              items={col.map((item, i) => ({
                id: `faq-${colIndex}-${i}`,
                title: item.question,
                content: item.answer,
              }))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
