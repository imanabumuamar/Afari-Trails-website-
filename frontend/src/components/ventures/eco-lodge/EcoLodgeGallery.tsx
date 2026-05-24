import Image from "next/image";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgeGallery as default_ecoLodgeGallery } from "@/lib/data/eco-lodge";

export async function EcoLodgeGallery() {
  const content = await getVenturePageContent("eco-lodge");
  const ecoLodgeGallery = content.ecoLodgeGallery as typeof default_ecoLodgeGallery;

  return (
    <section className="overflow-hidden bg-matte-black py-4 lg:py-6" aria-label="Visual immersion">
      <div className="flex gap-1 overflow-x-auto scrollbar-none lg:gap-1.5">
        {ecoLodgeGallery.map((frame) => (
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
