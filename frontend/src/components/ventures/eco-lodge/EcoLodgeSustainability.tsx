import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeSustainability as default_ecoLodgeSustainability } from "@/lib/data/eco-lodge";

export async function EcoLodgeSustainability() {
  const content = await getVenturePageContent("eco-lodge");
  const ecoLodgeSustainability = content.ecoLodgeSustainability as typeof default_ecoLodgeSustainability;

  return (
    <section className="bg-safari-green-deep py-24 text-ivory lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel light>{ecoLodgeSustainability.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light md:text-5xl">
            {ecoLodgeSustainability.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ivory/60">
            {ecoLodgeSustainability.intro}
          </p>
        </div>

        <ul className="mx-auto mt-16 grid max-w-5xl gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {ecoLodgeSustainability.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="bg-safari-green-deep px-8 py-10 lg:px-10 lg:py-12"
            >
              <h3 className="font-serif text-xl font-light text-ivory lg:text-2xl">
                {pillar.title}
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-ivory/55 md:text-sm">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
