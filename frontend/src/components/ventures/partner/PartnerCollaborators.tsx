import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { partnerCollaborators as default_partnerCollaborators } from "@/lib/data/partner";

export async function PartnerCollaborators() {
  const content = await getVenturePageContent("connect");
  const partnerCollaborators = content.partnerCollaborators as typeof default_partnerCollaborators;

  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{partnerCollaborators.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {partnerCollaborators.heading}
          </h2>
          <p className="mt-8 text-sm leading-[1.9] text-charcoal/65 md:text-base">
            {partnerCollaborators.body}
          </p>
        </div>

        <ul className="mx-auto mt-16 grid max-w-4xl gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          {partnerCollaborators.placeholders.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center bg-ivory px-6 py-10 text-center"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-charcoal/45">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
