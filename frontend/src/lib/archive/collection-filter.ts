import type { ArchiveCollection, ArchiveGridCategory } from "@/types/archive-content";

/** CMS collection id for Community Lens (previous community photos). */
export const COMMUNITY_LENS_COLLECTION_ID = "culture-people";

export const COMMUNITY_LENS_EDITIONS_HREF = `/archive?collection=${COMMUNITY_LENS_COLLECTION_ID}#grid`;

export function resolveCollectionFilter(
  raw: string | null | undefined,
  collections: ArchiveCollection[],
): ArchiveGridCategory | null {
  if (!raw || raw === "all") return null;
  const ids = new Set(collections.map((c) => c.id));
  return ids.has(raw) ? raw : null;
}
