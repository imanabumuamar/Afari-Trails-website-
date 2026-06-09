import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeWhatWeDo as default_ecoLodgeWhatWeDo } from "@/lib/data/eco-lodge";

type EcoLodgeWhatWeDoContent = {
  label: string;
  heading: string;
  intro: string;
  items: {
    id: string;
    title: string;
    description: string;
    image?: string;
  }[];
};

export async function EcoLodgeWhatWeDo() {
  const content = await getVenturePageContent("eco-lodge");
  const section = content.ecoLodgeWhatWeDo as EcoLodgeWhatWeDoContent;
  const defaultImages = default_ecoLodgeWhatWeDo.items;

  return (
    <section id="what-we-do" className="scroll-mt-24 bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <SectionLabel>{section.label}</SectionLabel>
            <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {section.heading}
            </h2>
          </div>
          {section.intro ? (
            <p className="text-sm leading-[1.85] text-charcoal/65 md:text-base lg:col-span-5">
              {section.intro}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {section.items.map((item, index) => {
            const fallbackImage =
              defaultImages.find((d) => d.id === item.id)?.image ??
              defaultImages[index % defaultImages.length]?.image ??
              "";
            const image = item.image || fallbackImage;

            return (
              <article
                key={item.id || item.title}
                className="group relative min-h-[400px] overflow-hidden bg-charcoal/10 lg:min-h-[440px]"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/92 via-matte-black/35 to-matte-black/10" />
                <span className="absolute left-5 top-5 inline-flex h-9 min-w-9 items-center justify-center bg-safari-green px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ivory">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-7 lg:p-8">
                  <h3 className="font-serif text-2xl font-light leading-snug text-ivory lg:text-[1.65rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/70 md:text-sm">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
