import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionPhilosophyProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionPhilosophy({ expedition }: ExpeditionPhilosophyProps) {
  return (
    <section className="bg-ivory py-28 lg:py-40">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold-muted">
          Our philosophy
        </p>
        <blockquote className="mt-10 font-serif text-3xl font-light leading-[1.35] text-charcoal md:text-4xl lg:text-[2.5rem] lg:leading-[1.3]">
          &ldquo;{expedition.philosophy.quote}&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
