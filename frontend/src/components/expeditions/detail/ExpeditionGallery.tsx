import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionGalleryProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionGallery({ expedition }: ExpeditionGalleryProps) {
  return (
    <section
      id="gallery"
      className="scroll-mt-24 bg-matte-black py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel light>Gallery</SectionLabel>
        <h2 className="font-serif text-4xl font-light text-ivory md:text-5xl">
          Moments from the trail
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-[1600px] px-3 lg:mt-20 lg:px-6">
        <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 lg:gap-3">
          {expedition.gallery.map((frame) => (
            <div
              key={frame.src}
              className={`relative mb-2 break-inside-avoid overflow-hidden lg:mb-3 ${
                frame.wide ? "sm:col-span-2" : ""
              }`}
            >
              <div
                className={`relative w-full ${
                  frame.wide ? "aspect-[16/9]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  className="object-cover opacity-95 transition-opacity duration-700 hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
