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
    <section id="approach" className="scroll-mt-24 bg-beige pt-12 pb-8 lg:pt-16 lg:pb-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>{agricultureApproach.label}</SectionLabel>
        <p className="mt-4 max-w-4xl font-serif text-2xl font-light leading-[1.3] text-charcoal sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]">
          {agricultureApproach.statement}
        </p>
        {paragraphs.length > 0 && (
          <div className="mt-10 max-w-3xl space-y-4 border-t border-charcoal/10 pt-10">
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
