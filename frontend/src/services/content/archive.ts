import { cache } from "react";
import { ARCHIVE_CONTENT_DEFAULTS } from "@/lib/data/archive-defaults";
import { COMMUNITY_LENS_EDITIONS_HREF } from "@/lib/archive/collection-filter";
import { normalizeArchiveImage } from "@/lib/archive/image-categories";
import { normalizeLatestMoments } from "@/lib/archive/latest-moments";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  ArchiveCollection,
  ArchiveContentData,
  ArchiveContentDocument,
  ArchiveImageRecord,
} from "@/types/archive-content";

function mergePage<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

function normalizeAfariLens(
  afariLens: ArchiveContentData["page"]["afariLens"],
  defaults: ArchiveContentData["page"]["afariLens"],
): ArchiveContentData["page"]["afariLens"] {
  const href = afariLens.editionsHref.trim();
  const editionsHref =
    href === "/archive#grid" || href === "#grid" || href === "/archive"
      ? COMMUNITY_LENS_EDITIONS_HREF
      : afariLens.editionsHref;

  return {
    ...defaults,
    ...afariLens,
    editionsHref,
    entriesLabel: afariLens.entriesLabel?.trim() || defaults.entriesLabel,
    editionsLabel: afariLens.editionsLabel?.trim() || defaults.editionsLabel,
  };
}

function mergeArchiveImages(
  defaults: ArchiveImageRecord[],
  remote: ArchiveImageRecord[] | undefined,
): ArchiveImageRecord[] {
  // Never saved a gallery — use defaults. An empty saved array means no photos.
  if (remote === undefined) return defaults;
  if (remote.length === 0) return [];

  // Saved gallery is authoritative — do not re-add defaults the editor removed.
  const defaultsById = new Map(defaults.map((img) => [img.id, img]));
  return remote.map((img) => {
    const base = defaultsById.get(img.id);
    const merged = base
      ? {
          ...base,
          ...img,
          published: img.published !== false,
          related: img.related ?? base.related,
        }
      : { ...img, published: img.published !== false };
    return normalizeArchiveImage(
      merged as Parameters<typeof normalizeArchiveImage>[0],
    );
  });
}

function mergeArchiveData(
  remote?: Partial<ArchiveContentData> | null,
): ArchiveContentData {
  const defaults = ARCHIVE_CONTENT_DEFAULTS;
  if (!remote) return defaults;

  const page = (remote.page ?? {}) as Partial<ArchiveContentData["page"]>;
  const images = mergeArchiveImages(defaults.images, remote.images);

  return {
    page: {
      hero: mergePage(defaults.page.hero, page.hero),
      collectionsSection: mergePage(
        defaults.page.collectionsSection,
        page.collectionsSection,
      ),
      afariLens: normalizeAfariLens(
        mergePage(defaults.page.afariLens, page.afariLens),
        defaults.page.afariLens,
      ),
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
    images,
    latestMoments: normalizeLatestMoments(
      remote.latestMoments,
      defaults.latestMoments,
      images,
    ),
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
    const doc = await fetchCmsJson<ArchiveContentDocument>("/content/archive", {
      revalidate: false,
    });
    if (doc?.data) return mergeArchiveData(doc.data);
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

export {
  getPublishedImages,
  getVisibleCollections,
  isArchiveCollectionVisible,
} from "@/lib/archive/archive-visibility";

export type {
  ArchiveCollection,
  ArchiveContentData,
  ArchiveImageRecord,
};
