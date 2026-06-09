import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { agricultureApproach as default_agricultureApproach } from "@/lib/data/agriculture";

type AgricultureApproachContent = {
  label: string;
  statement: string;
  body?: string;
  themes?: string[];
};

function resolveBody(section: AgricultureApproachContent): string[] {
  if (section.body?.trim()) {
    return section.body.split("\n\n").filter(Boolean);
  }
  if (section.themes && section.themes.length > 0) {
    return [section.themes.join(" ")];
  }
  const fallback = default_agricultureApproach.body;
  return fallback ? [fallback] : [];
}

export async function AgricultureApproach() {
  const content = await getVenturePageContent("agriculture");
  const agricultureApproach =
    content.agricultureApproach as AgricultureApproachContent;
  const paragraphs = resolveBody(agricultureApproach);

  return (
    <section id="approach" className="scroll-mt-24 bg-ivory py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>{agricultureApproach.label}</SectionLabel>
        <p className="mt-8 max-w-4xl font-serif text-3xl font-light leading-[1.25] text-charcoal sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.2]">
          {agricultureApproach.statement}
        </p>
        {paragraphs.length > 0 && (
          <div className="mt-16 max-w-3xl space-y-6 border-t border-charcoal/10 pt-16">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
