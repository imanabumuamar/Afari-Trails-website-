import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionHighlightsProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionHighlights({ expedition }: ExpeditionHighlightsProps) {
  return (
    <section className="border-y border-charcoal/8 bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>At a Glance</SectionLabel>
        <div className="mt-10 grid gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          {expedition.highlights.map((item) => (
            <div
              key={item.label}
              className="bg-beige px-6 py-8 lg:px-10 lg:py-10"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/45">
                {item.label}
              </p>
              <p className="mt-3 font-serif text-xl font-light text-charcoal md:text-2xl">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
