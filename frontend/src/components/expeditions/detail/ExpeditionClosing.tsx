import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionClosingProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionClosing({ expedition }: ExpeditionClosingProps) {
  return (
    <section className="relative bg-matte-black py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-matte-black via-safari-green-deep/40 to-matte-black" />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <p className="font-serif text-3xl font-light leading-[1.35] text-ivory md:text-4xl lg:text-5xl lg:leading-[1.25]">
          {expedition.closingQuote}
        </p>
      </div>
    </section>
  );
}
