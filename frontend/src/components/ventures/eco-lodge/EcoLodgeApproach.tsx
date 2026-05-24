import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeApproach as default_ecoLodgeApproach } from "@/lib/data/eco-lodge";

export async function EcoLodgeApproach() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeApproach as typeof default_ecoLodgeApproach;

  return (
    <section id="approach" className="scroll-mt-24 bg-charcoal py-24 text-ivory lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel light>{section.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light md:text-5xl">
            {section.heading}
          </h2>
        </div>

        <ul className="mt-16 grid gap-px bg-ivory/10 lg:grid-cols-3">
          {section.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="bg-charcoal px-8 py-12 lg:px-10 lg:py-14"
            >
              <h3 className="font-serif text-2xl font-light text-ivory lg:text-[1.75rem]">
                {pillar.title}
              </h3>
              <p className="mt-5 text-sm leading-[1.85] text-ivory/60">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
