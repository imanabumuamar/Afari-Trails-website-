import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionExperiencesProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionExperiences({ expedition }: ExpeditionExperiencesProps) {
  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>What Awaits</SectionLabel>
        <h2 className="max-w-2xl font-serif text-4xl font-light text-charcoal md:text-5xl">
          The experience
        </h2>

        <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-32">
          {expedition.experiences.map((item, index) => {
            const imageFirst = index % 2 === 1;

            return (
              <div
                key={item.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  className={`relative aspect-[5/4] overflow-hidden ${
                    imageFirst ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={imageFirst ? "lg:order-1 lg:pr-8" : "lg:pl-8"}>
                  <h3 className="font-serif text-3xl font-light text-charcoal md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-6 text-sm leading-[1.9] text-charcoal/70 md:text-base">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
