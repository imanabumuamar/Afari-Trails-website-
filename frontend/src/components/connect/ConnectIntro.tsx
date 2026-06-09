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
    <section className={`bg-beige ${sectionPad}`}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div
          className={`grid lg:grid-cols-2 lg:items-start ${
            compact ? "gap-10 lg:gap-16" : "gap-12 lg:gap-0"
          }`}
        >
          <div className="lg:pr-12 xl:pr-16">
            {intro.label && <SectionLabel>{intro.label}</SectionLabel>}
            <p className="font-serif text-3xl font-light leading-snug text-charcoal md:text-4xl lg:text-[2.65rem] lg:leading-[1.2]">
              {intro.statement}
            </p>
          </div>
          <div className="border-t border-charcoal/10 pt-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-2 xl:pl-16">
            <p className="max-w-lg text-sm leading-[1.9] text-charcoal/70 md:text-base lg:max-w-none">
              {intro.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
