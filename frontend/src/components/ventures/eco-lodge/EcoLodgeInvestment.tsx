import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeInvestment as default_ecoLodgeInvestment } from "@/lib/data/eco-lodge";

export async function EcoLodgeInvestment() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeInvestment as typeof default_ecoLodgeInvestment;
  const bodyParagraphs = section.body.split("\n\n").filter(Boolean);
  const themes = section.themes ?? [];

  return (
    <section id="investment" className="scroll-mt-24 bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div>
            <SectionLabel>{section.label}</SectionLabel>
            <div className="mt-8 space-y-6">
              {bodyParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {themes.length > 0 ? (
              <ul className="mt-10 space-y-3 border-t border-charcoal/10 pt-10">
                {themes.map((theme) => (
                  <li
                    key={theme}
                    className="flex items-start gap-3 text-sm text-charcoal/70 md:text-base"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                    {theme}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="border-t border-charcoal/10 pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
            <blockquote className="font-serif text-2xl font-light leading-snug text-charcoal md:text-3xl lg:text-[2rem] lg:leading-[1.35]">
              &ldquo;{section.statement}&rdquo;
            </blockquote>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href={section.partnerHref ?? "/contact"}
                className="inline-flex items-center justify-center bg-charcoal px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-matte-black"
              >
                {section.partnerCta}
              </Link>
              <Link
                href={section.deckHref ?? "/contact"}
                className="inline-flex items-center justify-center border border-charcoal/40 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal/5"
              >
                {section.deckCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
