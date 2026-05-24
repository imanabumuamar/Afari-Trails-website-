import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { communityPhilosophy as default_communityPhilosophy } from "@/lib/data/community";

export async function CommunityPhilosophy() {
  const content = await getVenturePageContent("community");
  const communityPhilosophy = content.communityPhilosophy as typeof default_communityPhilosophy;

  return (
    <section className="bg-ivory py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-7">
          <SectionLabel>{communityPhilosophy.label}</SectionLabel>
          <p className="mt-8 font-serif text-3xl font-light leading-[1.25] text-charcoal sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.2]">
            {communityPhilosophy.statement}
          </p>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2">
            {communityPhilosophy.themes.map((theme) => (
              <li
                key={theme}
                className="text-sm leading-relaxed text-charcoal/60"
              >
                {theme}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/10 lg:col-span-5">
          <Image
            src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&q=85"
            alt="Warm community gathering in natural light"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
