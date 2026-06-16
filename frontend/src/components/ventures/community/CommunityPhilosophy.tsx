import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { communityPhilosophy as default_communityPhilosophy } from "@/lib/data/community";

export async function CommunityPhilosophy() {
  const content = await getVenturePageContent("community");
  const communityPhilosophy = content.communityPhilosophy as typeof default_communityPhilosophy;

  return (
    <section className="bg-beige pt-12 pb-2 lg:pt-16 lg:pb-4">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-2xl">
          <SectionLabel>{communityPhilosophy.label}</SectionLabel>
          <p className="mt-4 font-serif text-2xl font-light leading-[1.3] text-charcoal sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]">
            {communityPhilosophy.statement}
          </p>
          {communityPhilosophy.themes.length > 0 && (
            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {communityPhilosophy.themes.map((theme) => (
                <li
                  key={theme}
                  className="text-xs leading-relaxed text-charcoal/60 sm:text-sm"
                >
                  {theme}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
