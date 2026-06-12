import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { conservationPartners as default_conservationPartners } from "@/lib/data/conservation";

export async function ConservationPartners() {
  const content = await getVenturePageContent("conservation");
  const conservationPartners = content.conservationPartners as typeof default_conservationPartners;

  return (
    <section
      id="partners"
      className="scroll-mt-24 bg-safari-green-deep py-24 text-ivory lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel light>{conservationPartners.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light md:text-5xl">
            {conservationPartners.heading}
          </h2>
          <p className="mt-8 text-sm leading-[1.9] text-ivory/65 md:text-base">
            {conservationPartners.body}
          </p>
        </div>

        <ul className="mx-auto mt-16 grid max-w-4xl gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {conservationPartners.placeholders.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center bg-safari-green-deep px-6 py-10 text-center"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-ivory/50">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
