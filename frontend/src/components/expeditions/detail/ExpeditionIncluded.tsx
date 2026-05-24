import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionIncludedProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionIncluded({ expedition }: ExpeditionIncludedProps) {
  return (
    <section className="bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionLabel>Essentials</SectionLabel>
            <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
              What&apos;s included
            </h2>
            <ul className="mt-10 space-y-4">
              {expedition.included.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-charcoal/10 pb-4 text-sm text-charcoal/80"
                >
                  <span className="text-gold-muted" aria-hidden>
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {expedition.notIncluded && expedition.notIncluded.length > 0 && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/45">
                Not included
              </p>
              <ul className="mt-10 space-y-4">
                {expedition.notIncluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b border-charcoal/10 pb-4 text-sm text-charcoal/55"
                  >
                    <span className="text-charcoal/30" aria-hidden>
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
