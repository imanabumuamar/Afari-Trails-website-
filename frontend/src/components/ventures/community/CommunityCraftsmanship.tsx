import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { communityCraftsmanship as default_communityCraftsmanship } from "@/lib/data/community";

export async function CommunityCraftsmanship() {
  const content = await getVenturePageContent("community");
  const communityCraftsmanship = content.communityCraftsmanship as typeof default_communityCraftsmanship;

  const [first, second, third] = communityCraftsmanship.images;

  return (
    <section className="grid lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-2 p-4 lg:gap-3 lg:p-8">
        <div className="hover-zoom relative aspect-square overflow-hidden bg-charcoal/10">
          <Image src={first.src} alt={first.alt} fill className="object-cover" sizes="25vw" />
        </div>
        <div className="hover-zoom relative aspect-square overflow-hidden bg-charcoal/10">
          <Image src={second.src} alt={second.alt} fill className="object-cover" sizes="25vw" />
        </div>
        <div className="hover-zoom relative col-span-2 aspect-[2/1] overflow-hidden bg-charcoal/10">
          <Image src={third.src} alt={third.alt} fill className="object-cover" sizes="50vw" />
        </div>
      </div>

      <div className="flex flex-col justify-center bg-sand-light/30 px-6 py-20 lg:px-14 lg:py-28">
        <SectionLabel>{communityCraftsmanship.label}</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {communityCraftsmanship.heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
          {communityCraftsmanship.body}
        </p>
        <ul className="mt-10 space-y-3 border-t border-charcoal/10 pt-10">
          {communityCraftsmanship.highlights.map((item) => (
            <li
              key={item}
              className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
