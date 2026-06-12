import { COMMUNITY_LENS_COLLECTION_ID } from "@/lib/archive/collection-filter";
import { normalizeArchiveImage } from "@/lib/archive/image-categories";
import type { ArchiveContentData, ArchiveImageRecord } from "@/types/archive-content";

/** Stable gallery id for the current Photograph of the Month spotlight. */
export const SPOTLIGHT_GALLERY_IMAGE_ID = "afari-lens-potm";

export function upsertSpotlightGalleryImage(
  data: ArchiveContentData,
  imageSrc: string,
): ArchiveContentData {
  const { afariLens } = data.page;
  const existingIndex = data.images.findIndex(
    (img) => img.id === SPOTLIGHT_GALLERY_IMAGE_ID,
  );
  const existing =
    existingIndex >= 0
      ? normalizeArchiveImage(data.images[existingIndex])
      : null;

  const categories = existing
    ? [...new Set([...existing.categories, COMMUNITY_LENS_COLLECTION_ID])]
    : [COMMUNITY_LENS_COLLECTION_ID];

  const record: ArchiveImageRecord = {
    id: SPOTLIGHT_GALLERY_IMAGE_ID,
    title: afariLens.title.trim() || "Photograph of the Month",
    location: existing?.location ?? "Zambia",
    photographer: afariLens.photographer.trim() || "Afari Trails",
    caption: afariLens.story.trim(),
    categories,
    image: imageSrc,
    published: true,
  };

  const images = [...data.images];
  if (existingIndex >= 0) {
    images[existingIndex] = record;
  } else {
    images.unshift(record);
  }

  return { ...data, images };
}
