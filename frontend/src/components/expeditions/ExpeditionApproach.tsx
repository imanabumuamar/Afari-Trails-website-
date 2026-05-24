import { PillarIcon } from "@/components/expeditions/PillarIcon";
import { getExpeditionsContent } from "@/services/content/expeditions";

export async function ExpeditionApproach() {
  const { page } = await getExpeditionsContent();
  const section = page.expeditionApproach;

  return (
    <section id="approach" className="scroll-mt-24 bg-matte-black py-20 text-ivory lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        <div>
          <h2 className="font-serif text-4xl font-light leading-tight md:text-5xl">
            {section.heading}
          </h2>
          <p className="mt-8 max-w-md text-sm leading-[1.85] text-ivory/65 md:text-base">
            {section.body}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-10">
          {section.pillars.map((pillar) => (
            <div key={pillar.title} className="text-center">
              <PillarIcon type={pillar.icon} />
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory/80">
                {pillar.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
