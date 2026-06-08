import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectIntroProps = {
  config: ConnectPageConfig;
  compact?: boolean;
};

export function ConnectIntro({ config, compact = false }: ConnectIntroProps) {
  const { intro } = config;
  const sectionPad = compact ? "py-12 lg:py-16" : "py-24 lg:py-36";

  return (
    <section className={`bg-ivory ${sectionPad}`}>
      <div
        className={`mx-auto grid max-w-[1400px] px-6 lg:grid-cols-2 lg:items-start lg:px-10 ${
          compact ? "gap-8 lg:gap-12" : "gap-14 lg:gap-20"
        }`}
      >
        <div>
          {intro.label && <SectionLabel>{intro.label}</SectionLabel>}
          <p className="font-serif text-3xl font-light leading-snug text-charcoal md:text-4xl lg:text-[2.65rem] lg:leading-[1.2]">
            {intro.statement}
          </p>
        </div>
        <div className="border-t border-charcoal/10 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
          <p className="text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {intro.body}
          </p>
        </div>
      </div>
    </section>
  );
}
