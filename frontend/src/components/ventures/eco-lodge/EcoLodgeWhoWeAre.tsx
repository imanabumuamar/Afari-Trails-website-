import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeWhoWeAre as default_ecoLodgeWhoWeAre } from "@/lib/data/eco-lodge";

export async function EcoLodgeWhoWeAre() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeWhoWeAre as typeof default_ecoLodgeWhoWeAre;
  const paragraphs = section.body.split("\n\n").filter(Boolean);

  return (
    <section id="who-we-are" className="scroll-mt-24 bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-3xl">
          <SectionLabel>{section.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal md:text-5xl lg:text-[3.25rem]">
            {section.heading}
          </h2>
          <div className="mt-10 space-y-6">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
