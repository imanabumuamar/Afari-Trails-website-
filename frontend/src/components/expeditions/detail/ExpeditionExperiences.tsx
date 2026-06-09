import Image from "next/image";
import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionExperiencesProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionExperiences({ expedition }: ExpeditionExperiencesProps) {
  if (expedition.experiences.length === 0) return null;
  const sections = resolveSectionCopy(expedition);

  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ExpeditionEyebrow>{sections.experiencesLabel}</ExpeditionEyebrow>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl font-light text-charcoal md:text-5xl">
          {sections.experiencesHeading}
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {expedition.experiences.map((item) => (
            <div
              key={item.title}
              className="group relative aspect-[3/5] overflow-hidden bg-charcoal/10"
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/85 via-matte-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ivory/90">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
