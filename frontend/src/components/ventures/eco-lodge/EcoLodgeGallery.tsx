import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import {
  ecoLodgeGallery as default_ecoLodgeGallery,
  ecoLodgeGalleryIntro as default_ecoLodgeGalleryIntro,
} from "@/lib/data/eco-lodge";

export async function EcoLodgeGallery() {
  const content = await getVenturePageContent("eco-lodge");
  const gallery = content.ecoLodgeGallery as typeof default_ecoLodgeGallery;
  const intro = content.ecoLodgeGalleryIntro as typeof default_ecoLodgeGalleryIntro;

  return (
    <section className="bg-matte-black py-16 lg:py-20" aria-label="Visual gallery">
      <div className="mx-auto max-w-[1400px] px-6 pb-10 lg:px-10">
        <SectionLabel light>{intro.label}</SectionLabel>
        <h2 className="font-serif text-3xl font-light text-ivory md:text-4xl">
          {intro.heading}
        </h2>
      </div>
      <div className="flex gap-1 overflow-x-auto scrollbar-none lg:gap-1.5">
        {gallery.map((frame) => (
          <div
            key={frame.src}
            className="relative h-[50vh] min-h-[320px] w-[min(92vw,640px)] shrink-0 lg:h-[70vh] lg:w-[720px]"
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              className="object-cover opacity-95"
              sizes="720px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
