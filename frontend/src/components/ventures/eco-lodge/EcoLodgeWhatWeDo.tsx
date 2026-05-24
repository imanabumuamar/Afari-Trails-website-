import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";

type EcoLodgeWhatWeDoContent = {
  label: string;
  heading: string;
  intro: string;
  items: { id: string; title: string; description: string }[];
};

export async function EcoLodgeWhatWeDo() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeWhatWeDo as EcoLodgeWhatWeDoContent;

  return (
    <section id="what-we-do" className="scroll-mt-24 bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-2xl">
          <SectionLabel>{section.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {section.heading}
          </h2>
          {section.intro ? (
            <p className="mt-6 text-sm leading-[1.85] text-charcoal/65 md:text-base">
              {section.intro}
            </p>
          ) : null}
        </div>

        <ol className="mt-14 grid gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item, index) => (
            <li
              key={item.id || item.title}
              className="flex flex-col bg-ivory px-8 py-10 lg:px-10 lg:py-12"
            >
              <span className="font-serif text-3xl font-light text-gold-muted/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-xl font-light text-charcoal lg:text-2xl">
                {item.title}
              </h3>
              <p className="mt-4 flex-1 text-xs leading-relaxed text-charcoal/65 md:text-sm">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
