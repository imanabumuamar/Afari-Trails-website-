import type { ArchiveImageRecord, CollectionId } from "@/types/archive-content";

type LegacyArchiveImage = ArchiveImageRecord & { category?: CollectionId };

export function normalizeArchiveImage(
  image: LegacyArchiveImage,
): ArchiveImageRecord {
  const categories =
    Array.isArray(image.categories) && image.categories.length > 0
      ? [...new Set(image.categories)]
      : image.category
        ? [image.category]
        : ["wildlife"];

  const { category: _legacy, ...rest } = image;
  return {
    ...rest,
    categories,
    published: image.published !== false,
  };
}

export function imageBelongsToCollection(
  image: ArchiveImageRecord,
  collectionId: CollectionId,
): boolean {
  const normalized = normalizeArchiveImage(image);
  return normalized.categories.includes(collectionId);
}

export function primaryImageCategory(image: ArchiveImageRecord): CollectionId {
  return normalizeArchiveImage(image).categories[0];
}
