import type { ExpeditionDetail } from "@/types/expedition-detail";

export const ACCOMMODATION_PHOTO_LIMIT = 5;

type AccommodationLike = ExpeditionDetail["accommodation"];

export function resolveAccommodationPhotos(
  accommodation: AccommodationLike,
): { src: string; alt: string }[] {
  const fromSide = (accommodation.sideImages ?? [])
    .filter((img) => img.src?.trim())
    .map((img) => ({ src: img.src.trim(), alt: img.alt ?? "" }));

  if (fromSide.length > 0) {
    return fromSide.slice(0, ACCOMMODATION_PHOTO_LIMIT);
  }

  const legacyMain = accommodation.image?.trim();
  if (legacyMain) {
    return [
      {
        src: legacyMain,
        alt: accommodation.imageAlt?.trim() ?? "",
      },
    ];
  }

  return [];
}

export function normalizeAccommodationForEditor(
  accommodation: AccommodationLike,
): AccommodationLike {
  const photos = resolveAccommodationPhotos(accommodation);
  return {
    ...accommodation,
    image: "",
    imageAlt: "",
    sideImages: photos.map((photo) => ({
      src: photo.src,
      alt: photo.alt,
    })),
  };
}

export function pruneAccommodationPhotos(
  accommodation: AccommodationLike,
): AccommodationLike {
  const sideImages = (accommodation.sideImages ?? [])
    .filter((img) => img.src?.trim() || img.alt?.trim())
    .slice(0, ACCOMMODATION_PHOTO_LIMIT)
    .map((img) => ({ src: img.src ?? "", alt: img.alt ?? "" }));

  return {
    ...accommodation,
    image: "",
    imageAlt: "",
    sideImages,
  };
}
