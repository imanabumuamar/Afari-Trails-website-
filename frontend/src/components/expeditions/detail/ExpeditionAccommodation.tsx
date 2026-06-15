import Image from "next/image";
import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { resolveAccommodationPhotos } from "@/lib/expeditions/expedition-accommodation-photos";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionAccommodationProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionAccommodation({
  expedition,
}: ExpeditionAccommodationProps) {
  const { accommodation } = expedition;
  const sections = resolveSectionCopy(expedition);
  const features = accommodation.features ?? [];
  const photos = resolveAccommodationPhotos(accommodation);
  const [mainPhoto, ...sidePhotos] = photos;
  const hasImages = photos.length > 0;

  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div
          className={
            hasImages ? "lg:col-span-4" : "lg:col-span-12 lg:max-w-2xl"
          }
        >
          <ExpeditionEyebrow>{sections.accommodationLabel}</ExpeditionEyebrow>
          <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
            {accommodation.heading}
          </h2>
          <p className="mt-6 text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {accommodation.body}
          </p>
          {features.length > 0 && (
            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-charcoal/75"
                >
                  <span className="mt-0.5 text-safari-green" aria-hidden>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        {mainPhoto && (
          <div className="relative aspect-[5/4] overflow-hidden bg-charcoal/10 lg:col-span-5">
            <Image
              src={mainPhoto.src}
              alt={mainPhoto.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        )}

        {sidePhotos.length > 0 && (
          <div
            className={`grid grid-cols-3 gap-3 ${
              mainPhoto ? "lg:col-span-3 lg:grid-cols-1" : "lg:col-span-8"
            }`}
          >
            {sidePhotos.map((img, index) => (
              <div
                key={`${img.src}-${index}`}
                className="relative aspect-square overflow-hidden bg-charcoal/10"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
