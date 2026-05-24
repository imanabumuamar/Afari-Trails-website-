import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { featuredExpeditions } from "@/lib/data/expeditions";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionRelatedProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionRelated({ expedition }: ExpeditionRelatedProps) {
  const related = expedition.relatedIds
    .map((id) => featuredExpeditions.find((e) => e.id === id))
    .filter((e): e is (typeof featuredExpeditions)[number] => Boolean(e));

  if (related.length === 0) return null;

  return (
    <section className="bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>Continue exploring</SectionLabel>
        <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
          Related expeditions
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((exp) => (
            <Link key={exp.id} href={`/expeditions/${exp.id}`} className="group">
              <div className="hover-zoom relative aspect-[4/5] overflow-hidden bg-charcoal/10">
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-2xl font-light text-charcoal transition-colors group-hover:text-gold-muted">
                  {exp.name}
                </h3>
                <p className="mt-2 text-sm text-charcoal/55">{exp.tagline}</p>
                <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
                  {exp.duration}
                  <span className="ml-2 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
