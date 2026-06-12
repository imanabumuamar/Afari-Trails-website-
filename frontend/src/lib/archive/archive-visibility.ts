import type { ArchiveCollection, ArchiveImageRecord } from "@/types/archive-content";

export const ARCHIVE_COLLECTIONS_PREVIEW_COUNT = 6;

export function isArchiveCollectionVisible(
  collection: ArchiveCollection,
): boolean {
  return collection.hidden !== true;
}

export function getVisibleCollections(
  collections: ArchiveCollection[],
): ArchiveCollection[] {
  return collections.filter(isArchiveCollectionVisible);
}

export function isArchiveImagePublished(image: ArchiveImageRecord): boolean {
  return image.published !== false;
}

export function getPublishedImages(
  images: ArchiveImageRecord[],
): ArchiveImageRecord[] {
  return images.filter(isArchiveImagePublished);
}
