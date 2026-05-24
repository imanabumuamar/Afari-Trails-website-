"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionFaqProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionFaq({ expedition }: ExpeditionFaqProps) {
  const items = expedition.faq.map((item, i) => ({
    id: `faq-${i}`,
    title: item.question,
    content: item.answer,
  }));

  return (
    <section className="bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <SectionLabel>Questions</SectionLabel>
        <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
          Before you travel
        </h2>
        <div className="mt-14">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
