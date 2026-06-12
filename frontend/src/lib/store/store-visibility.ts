import type { EditorialCollection } from "@/types/store-content";

export function isStoreCollectionVisible(
  collection: EditorialCollection,
): boolean {
  return collection.hidden !== true;
}

export function visibleStoreCollections(
  collections: EditorialCollection[],
): EditorialCollection[] {
  return collections.filter(isStoreCollectionVisible);
}
