import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionIntroProps = {
  expedition: ExpeditionDetail;
};

function HighlightIcon({ label }: { label: string }) {
  const cls = "h-5 w-5 text-gold-muted";
  const l = label.toLowerCase();
  if (l.includes("location") || l.includes("region")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
        <path d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (l.includes("accommodation")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
        <path d="M4 10l8-6 8 6v10H4z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export function ExpeditionIntro({ expedition }: ExpeditionIntroProps) {
  const sections = resolveSectionCopy(expedition);

  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div>
          <ExpeditionEyebrow>{sections.overviewLabel}</ExpeditionEyebrow>
          <h2 className="mt-4 font-serif text-3xl font-light leading-[1.15] text-charcoal md:text-4xl lg:text-[2.65rem]">
            {sections.overviewHeading}
          </h2>
          <p className="mt-6 text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {expedition.intro.body}
          </p>
        </div>

        <div className="grid gap-px bg-charcoal/8 sm:grid-cols-2">
          {expedition.highlights
            .filter((item) => item.label !== "Difficulty")
            .map((item) => (
            <div
              key={item.label}
              className="flex gap-4 bg-ivory px-5 py-6 lg:px-6 lg:py-7"
            >
              <HighlightIcon label={item.label} />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-charcoal/45">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
