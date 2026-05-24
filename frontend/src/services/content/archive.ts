import { cache } from "react";
import { ARCHIVE_CONTENT_DEFAULTS } from "@/lib/data/archive-defaults";
import { getApiBaseUrl } from "@/lib/api/backend";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  ArchiveCollection,
  ArchiveContentData,
  ArchiveContentDocument,
  ArchiveImageRecord,
  ArchiveLatestMoment,
} from "@/types/archive-content";

function mergePage<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

function mergeArchiveImages(
  defaults: ArchiveImageRecord[],
  remote: ArchiveImageRecord[] | undefined,
): ArchiveImageRecord[] {
  if (!remote || remote.length === 0) return defaults;

  const remoteById = new Map(remote.map((img) => [img.id, img]));
  const merged = defaults.map((img) => {
    const patch = remoteById.get(img.id);
    if (!patch) return img;
    return {
      ...img,
      ...patch,
      published: patch.published !== false,
      related: patch.related ?? img.related,
    };
  });

  for (const img of remote) {
    if (!defaults.some((d) => d.id === img.id)) {
      merged.push({ ...img, published: img.published !== false });
    }
  }

  return merged;
}

function mergeArchiveData(
  remote?: Partial<ArchiveContentData> | null,
): ArchiveContentData {
  const defaults = ARCHIVE_CONTENT_DEFAULTS;
  if (!remote) return defaults;

  const page = (remote.page ?? {}) as Partial<ArchiveContentData["page"]>;
  return {
    page: {
      hero: mergePage(defaults.page.hero, page.hero),
      collectionsSection: mergePage(
        defaults.page.collectionsSection,
        page.collectionsSection,
      ),
      afariLens: mergePage(defaults.page.afariLens, page.afariLens),
      latestMomentsSection: mergePage(
        defaults.page.latestMomentsSection,
        page.latestMomentsSection,
      ),
      archiveSubmit: mergePage(defaults.page.archiveSubmit, page.archiveSubmit),
      submitPage: mergePage(defaults.page.submitPage, page.submitPage),
    },
    collections:
      Array.isArray(remote.collections) && remote.collections.length > 0
        ? remote.collections
        : defaults.collections,
    latestMoments:
      Array.isArray(remote.latestMoments) && remote.latestMoments.length > 0
        ? remote.latestMoments
        : defaults.latestMoments,
    images: mergeArchiveImages(defaults.images, remote.images),
  };
}

export function getArchiveContentLocal(): ArchiveContentData {
  try {
    const doc = readJsonFile<Partial<ArchiveContentDocument>>("archive.json");
    return mergeArchiveData(doc.data);
  } catch {
    return ARCHIVE_CONTENT_DEFAULTS;
  }
}

export const getArchiveContent = cache(
  async (): Promise<ArchiveContentData> => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/content/archive`, {
        next: { revalidate: 30 },
      });
      if (res.ok) {
        const doc = (await res.json()) as ArchiveContentDocument;
        return mergeArchiveData(doc.data);
      }
    } catch {
      // API offline
    }
    return getArchiveContentLocal();
  },
);

export function saveArchiveContentLocal(
  data: ArchiveContentData,
): ArchiveContentDocument {
  const doc: ArchiveContentDocument = {
    key: "main",
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("archive.json", doc);
  return doc;
}

export function getPublishedImages(
  images: ArchiveImageRecord[],
): ArchiveImageRecord[] {
  return images.filter((img) => img.published !== false);
}

export type {
  ArchiveCollection,
  ArchiveContentData,
  ArchiveImageRecord,
  ArchiveLatestMoment,
};
