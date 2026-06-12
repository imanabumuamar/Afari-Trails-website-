import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { partnerIntro as default_partnerIntro } from "@/lib/data/partner";

export async function PartnerIntro() {
  const content = await getVenturePageContent("connect");
  const partnerIntro = content.partnerIntro as typeof default_partnerIntro;

  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-2 lg:items-start lg:gap-20 lg:px-10">
        <div className="animate-fade-in lg:pr-8">
          <SectionLabel>Our Approach</SectionLabel>
          <p className="font-serif text-3xl font-light leading-snug text-charcoal md:text-4xl lg:text-[2.65rem] lg:leading-[1.2]">
            {partnerIntro.statement}
          </p>
        </div>
        <div
          className="animate-fade-in border-t border-charcoal/10 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16"
          style={{ animationDelay: "0.15s" }}
        >
          <p className="max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {partnerIntro.body}
          </p>
        </div>
      </div>
    </section>
  );
}
