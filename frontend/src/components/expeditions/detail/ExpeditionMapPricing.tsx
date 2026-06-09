import Image from "next/image";
import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionMapPricingProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionMapPricing({ expedition }: ExpeditionMapPricingProps) {
  const sections = resolveSectionCopy(expedition);
  const hasMap = Boolean(expedition.map?.image);
  const hasPricing = Boolean(expedition.pricing?.amount);
  const hasIncluded =
    expedition.included.length > 0 ||
    (expedition.notIncluded && expedition.notIncluded.length > 0);

  if (!hasMap && !hasPricing && !hasIncluded) return null;

  return (
    <section className="bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {hasMap && expedition.map && (
            <div className="lg:col-span-5">
              <ExpeditionEyebrow>{sections.mapLabel}</ExpeditionEyebrow>
              <h2 className="mt-4 font-serif text-3xl font-light text-charcoal">
                {sections.mapHeading}
              </h2>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden border border-charcoal/10 bg-ivory">
                <Image
                  src={expedition.map.image}
                  alt={expedition.map.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              {expedition.map.mapsUrl && (
                <a
                  href={expedition.map.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/60 transition-colors hover:text-charcoal"
                >
                  {sections.mapCtaLabel} →
                </a>
              )}
            </div>
          )}

          <div className={hasMap ? "lg:col-span-7" : "lg:col-span-12"}>
            {hasIncluded && (
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/45">
                    {sections.includedLabel}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {expedition.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-charcoal/80"
                      >
                        <span className="text-safari-green" aria-hidden>
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {expedition.notIncluded && expedition.notIncluded.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/45">
                      {sections.notIncludedLabel}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {expedition.notIncluded.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-charcoal/60"
                        >
                          <span className="text-charcoal/35" aria-hidden>
                            ×
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {hasPricing && expedition.pricing && (
              <div className="mt-10 max-w-md border border-charcoal/12 bg-ivory p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/45">
                  {sections.pricingLabel}
                </p>
                <p className="mt-3 font-serif text-3xl font-light text-charcoal">
                  {expedition.pricing.currency} {expedition.pricing.amount}
                </p>
                {expedition.pricing.note && (
                  <p className="mt-2 text-xs text-charcoal/55">
                    {expedition.pricing.note}
                  </p>
                )}
                <a
                  href="#inquiry"
                  className="mt-6 inline-flex w-full items-center justify-center bg-safari-green px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-safari-green-deep"
                >
                  {sections.enquireLabel}
                </a>
                {expedition.brochureUrl && (
                  <a
                    href={expedition.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center text-[10px] uppercase tracking-[0.2em] text-charcoal/55 hover:text-charcoal"
                  >
                    {sections.brochureLabel} (PDF)
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
