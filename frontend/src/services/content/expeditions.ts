import { cache } from "react";
import { EXPEDITIONS_CONTENT_DEFAULTS } from "@/lib/data/expedition-defaults";
import { isExpeditionListed } from "@/lib/expeditions/expedition-listing-status";
import { mergeExpeditionsData } from "@/lib/expeditions/merge-expeditions-data";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
  ExpeditionsContentDocument,
  FeaturedExpeditionCard,
} from "@/types/expeditions-content";
import type { ExpeditionCatalogItem } from "@/types/expeditions-content";

export { mergeExpeditionsData } from "@/lib/expeditions/merge-expeditions-data";

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
    let localDoc: ExpeditionsContentDocument | null = null;
    try {
      localDoc = readJsonFile<ExpeditionsContentDocument>("expeditions.json");
    } catch {
      localDoc = null;
    }

    const local = localDoc
      ? mergeExpeditionsData(localDoc.data)
      : EXPEDITIONS_CONTENT_DEFAULTS;

    const doc = await fetchCmsJson<ExpeditionsContentDocument>(
      "/content/expeditions",
    );
    if (!doc?.data) return local;

    const remote = mergeExpeditionsData(doc.data);
    if (!localDoc?.updatedAt) return remote;

    const localTime = new Date(localDoc.updatedAt).getTime();
    const remoteTime = new Date(doc.updatedAt ?? 0).getTime();
    return localTime >= remoteTime ? local : remote;
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
    comingSoon: exp.comingSoon === true,
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
    regionId: exp.regionId ?? "zambia",
    comingSoon: exp.comingSoon === true,
  };
}

export async function getPublishedExpeditions(): Promise<ExpeditionDetailRecord[]> {
  const { expeditions } = await getExpeditionsContent();
  return expeditions.filter(isExpeditionListed);
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
    .filter(isExpeditionListed)
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
