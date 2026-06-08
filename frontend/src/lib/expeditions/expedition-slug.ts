import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
} from "@/types/expeditions-content";

export function slugifyExpeditionId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function rewriteImagePath(
  src: string,
  oldId: string,
  newId: string,
): string {
  if (oldId === newId) return src;
  const prefix = `/images/expeditions/${oldId}/`;
  return src.includes(prefix)
    ? src.replace(prefix, `/images/expeditions/${newId}/`)
    : src;
}

/** Updates expedition id and local image paths that use /images/expeditions/{id}/. */
export function applyExpeditionIdRename(
  expedition: ExpeditionDetailRecord,
  oldId: string,
  newId: string,
): ExpeditionDetailRecord {
  if (oldId === newId) return expedition;

  return {
    ...expedition,
    id: newId,
    heroImage: rewriteImagePath(expedition.heroImage, oldId, newId),
    visualStrip: expedition.visualStrip.map((v) => ({
      ...v,
      src: rewriteImagePath(v.src, oldId, newId),
    })),
    accommodation: {
      ...expedition.accommodation,
      image: rewriteImagePath(expedition.accommodation.image, oldId, newId),
    },
    experiences: expedition.experiences.map((ex) => ({
      ...ex,
      image: rewriteImagePath(ex.image, oldId, newId),
    })),
    gallery: expedition.gallery.map((frame) => ({
      ...frame,
      src: rewriteImagePath(frame.src, oldId, newId),
    })),
  };
}

export function saveExpeditionInContent(
  data: ExpeditionsContentData,
  previousId: string,
  expedition: ExpeditionDetailRecord,
): ExpeditionsContentData | { error: string } {
  const slug = slugifyExpeditionId(expedition.id);
  if (!slug) {
    return { error: "URL slug cannot be empty." };
  }
  if (
    data.expeditions.some((e) => e.id === slug && e.id !== previousId)
  ) {
    return { error: `The slug "${slug}" is already used by another expedition.` };
  }

  const expeditions = data.expeditions.map((e) => {
    if (e.id === previousId) {
      return applyExpeditionIdRename(
        { ...expedition, id: slug },
        previousId,
        slug,
      );
    }
    return {
      ...e,
      relatedIds: e.relatedIds.map((rid) => (rid === previousId ? slug : rid)),
    };
  });

  const featuredIds = data.featuredIds.map((fid) =>
    fid === previousId ? slug : fid,
  );

  return { ...data, expeditions, featuredIds };
}
