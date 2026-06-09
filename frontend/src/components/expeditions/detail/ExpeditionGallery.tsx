import Image from "next/image";
import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionGalleryProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionGallery({ expedition }: ExpeditionGalleryProps) {
  if (expedition.gallery.length === 0) return null;
  const sections = resolveSectionCopy(expedition);

  return (
    <section id="gallery" className="scroll-mt-24 bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ExpeditionEyebrow>{sections.galleryLabel}</ExpeditionEyebrow>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {sections.galleryHeading}
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-[1600px] px-3 lg:mt-16 lg:px-6">
        <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 lg:gap-3">
          {expedition.gallery.map((frame, index) => (
            <div
              key={`${frame.src}-${index}`}
              className="relative mb-2 break-inside-avoid overflow-hidden lg:mb-3"
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
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <a
          href="#gallery"
          className="inline-block border border-charcoal/20 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal"
        >
          {sections.galleryCtaLabel}
        </a>
      </div>
    </section>
  );
}
