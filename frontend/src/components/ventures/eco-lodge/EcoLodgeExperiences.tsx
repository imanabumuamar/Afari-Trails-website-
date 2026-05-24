import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeExperiences as default_ecoLodgeExperiences } from "@/lib/data/eco-lodge";

export async function EcoLodgeExperiences() {
  const content = await getVenturePageContent("eco-lodge");
  const ecoLodgeExperiences = content.ecoLodgeExperiences as typeof default_ecoLodgeExperiences;

  return (
    <section id="experience" className="scroll-mt-24 bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>{ecoLodgeExperiences.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {ecoLodgeExperiences.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/60 md:text-base">
            {ecoLodgeExperiences.intro}
          </p>
        </div>

        <div className="mt-14 flex gap-4 overflow-x-auto pb-2 scrollbar-none lg:mt-16 lg:gap-5">
          {ecoLodgeExperiences.items.map((item) => (
            <article
              key={item.id}
              className="hover-zoom relative h-[360px] w-[min(78vw,300px)] shrink-0 overflow-hidden bg-charcoal/10 lg:h-[420px] lg:w-[340px]"
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover"
                sizes="340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/85 via-matte-black/25 to-transparent" />
              <h3 className="absolute inset-x-0 bottom-0 p-6 font-serif text-2xl font-light text-ivory">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
