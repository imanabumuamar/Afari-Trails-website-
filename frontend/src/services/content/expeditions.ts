import { cache } from "react";
import { EXPEDITIONS_CONTENT_DEFAULTS } from "@/lib/data/expedition-defaults";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
  ExpeditionsContentDocument,
  FeaturedExpeditionCard,
} from "@/types/expeditions-content";
import type { ExpeditionCatalogItem } from "@/types/expeditions-content";

function mergePage<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

function mergeExpeditionsData(
  remote?: Partial<ExpeditionsContentData> | null,
): ExpeditionsContentData {
  const defaults = EXPEDITIONS_CONTENT_DEFAULTS;
  if (!remote) return defaults;

  const page = (remote.page ?? {}) as Partial<ExpeditionsContentData["page"]>;
  return {
    page: {
      hero: mergePage(defaults.page.hero, page.hero),
      ourPromise: mergePage(defaults.page.ourPromise, page.ourPromise),
      categoryBar:
        Array.isArray(page.categoryBar) && page.categoryBar.length > 0
          ? page.categoryBar
          : defaults.page.categoryBar,
      expeditionApproach: mergePage(
        defaults.page.expeditionApproach,
        page.expeditionApproach,
      ),
      expeditionsCta: mergePage(defaults.page.expeditionsCta, page.expeditionsCta),
    },
    featuredIds:
      Array.isArray(remote.featuredIds) && remote.featuredIds.length > 0
        ? remote.featuredIds
        : defaults.featuredIds,
    expeditions:
      Array.isArray(remote.expeditions) && remote.expeditions.length > 0
        ? remote.expeditions
        : defaults.expeditions,
  };
}

export function getExpeditionsContentLocal(): ExpeditionsContentData {
  try {
    const doc = readJsonFile<Partial<ExpeditionsContentDocument>>("expeditions.json");
    return mergeExpeditionsData(doc.data);
  } catch {
    return EXPEDITIONS_CONTENT_DEFAULTS;
  }
}

export const getExpeditionsContent = cache(
  async (): Promise<ExpeditionsContentData> => {
    const doc = await fetchCmsJson<ExpeditionsContentDocument>(
      "/content/expeditions",
    );
    if (doc?.data) return mergeExpeditionsData(doc.data);
    return getExpeditionsContentLocal();
  },
);

export function saveExpeditionsContentLocal(
  data: ExpeditionsContentData,
): ExpeditionsContentDocument {
  const doc: ExpeditionsContentDocument = {
    key: "main",
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("expeditions.json", doc);
  return doc;
}

function highlightValue(
  exp: ExpeditionDetailRecord,
  label: string,
): string {
  return exp.highlights.find((h) => h.label === label)?.value ?? "";
}

export function toFeaturedCard(exp: ExpeditionDetailRecord): FeaturedExpeditionCard {
  return {
    id: exp.id,
    name: exp.name,
    tagline: exp.tagline,
    duration: highlightValue(exp, "Duration"),
    image: exp.heroImage,
  };
}

export function toCatalogItem(exp: ExpeditionDetailRecord): ExpeditionCatalogItem {
  return {
    id: exp.id,
    name: exp.name,
    title: exp.title,
    tagline: exp.tagline,
    duration: highlightValue(exp, "Duration"),
    location: highlightValue(exp, "Location"),
    style: highlightValue(exp, "Style"),
    heroImage: exp.heroImage,
    intro: exp.intro.statement,
  };
}

export async function getPublishedExpeditions(): Promise<ExpeditionDetailRecord[]> {
  const { expeditions } = await getExpeditionsContent();
  return expeditions.filter((e) => e.published !== false);
}

export async function getExpeditionBySlug(
  slug: string,
): Promise<ExpeditionDetailRecord | undefined> {
  const { expeditions } = await getExpeditionsContent();
  return expeditions.find((e) => e.id === slug);
}

export async function getAllExpeditionSlugsAsync(): Promise<string[]> {
  const { expeditions } = await getExpeditionsContent();
  return expeditions.map((e) => e.id);
}

export async function getCatalogExpeditions(): Promise<ExpeditionCatalogItem[]> {
  const published = await getPublishedExpeditions();
  return published.map(toCatalogItem);
}

export async function getFeaturedExpeditionCards(): Promise<FeaturedExpeditionCard[]> {
  const { featuredIds, expeditions } = await getExpeditionsContent();
  const byId = new Map(expeditions.map((e) => [e.id, e]));
  return featuredIds
    .map((id) => byId.get(id))
    .filter((e): e is ExpeditionDetailRecord => Boolean(e))
    .filter((e) => e.published !== false)
    .map(toFeaturedCard);
}

export async function getRelatedExpeditionCards(
  relatedIds: readonly string[],
): Promise<FeaturedExpeditionCard[]> {
  const { expeditions } = await getExpeditionsContent();
  const byId = new Map(expeditions.map((e) => [e.id, e]));
  return relatedIds
    .map((id) => byId.get(id))
    .filter((e): e is ExpeditionDetailRecord => Boolean(e))
    .map(toFeaturedCard);
}
