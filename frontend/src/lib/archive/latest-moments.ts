import type { ArchiveImageRecord } from "@/types/archive-content";

export type ResolvedLatestMoment = {
  id: string;
  image: string;
  alt: string;
};

type LegacyLatestMoment = {
  id?: string;
  imageId?: string;
  alt?: string;
  image?: string;
};

/** CMS value: ordered gallery image IDs. */
export function normalizeLatestMoments(
  remote: unknown,
  defaults: string[],
  galleryImages: ArchiveImageRecord[],
): string[] {
  if (!Array.isArray(remote) || remote.length === 0) return defaults;

  const galleryIds = new Set(galleryImages.map((img) => img.id));
  const ids: string[] = [];

  for (const item of remote) {
    if (typeof item === "string" && item.length > 0) {
      ids.push(item);
      continue;
    }
    if (!item || typeof item !== "object") continue;

    const legacy = item as LegacyLatestMoment;
    if (typeof legacy.imageId === "string" && legacy.imageId) {
      ids.push(legacy.imageId);
      continue;
    }
    if (typeof legacy.id === "string" && galleryIds.has(legacy.id)) {
      ids.push(legacy.id);
      continue;
    }
    if (typeof legacy.image === "string") {
      const match = galleryImages.find((img) => img.image === legacy.image);
      if (match) ids.push(match.id);
    }
  }

  return ids.length > 0 ? ids : defaults;
}

export function resolveLatestMoments(
  momentIds: string[],
  images: ArchiveImageRecord[],
): ResolvedLatestMoment[] {
  const byId = new Map(images.map((img) => [img.id, img]));

  return momentIds
    .map((id) => byId.get(id))
    .filter(
      (img): img is ArchiveImageRecord =>
        !!img && img.published !== false && !!img.image,
    )
    .map((img) => ({
      id: img.id,
      image: img.image,
      alt: img.title,
    }));
}
