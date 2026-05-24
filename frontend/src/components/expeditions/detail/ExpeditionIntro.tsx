import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionIntroProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionIntro({ expedition }: ExpeditionIntroProps) {
  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <h2 className="font-serif text-3xl font-light leading-[1.2] text-charcoal md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {expedition.intro.statement}
        </h2>
        <p className="text-sm leading-[1.9] text-charcoal/70 md:text-base lg:pt-2">
          {expedition.intro.body}
        </p>
      </div>
    </section>
  );
}
