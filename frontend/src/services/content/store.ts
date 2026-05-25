import { cache } from "react";
import { STORE_CONTENT_DEFAULTS } from "@/lib/data/store-defaults";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  Product,
  StoreContentData,
  StoreContentDocument,
} from "@/types/store-content";

function mergeSection<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

function mergeStoreData(
  remote?: Partial<StoreContentData> | null,
): StoreContentData {
  const d: StoreContentData = STORE_CONTENT_DEFAULTS;
  if (!remote) return d;

  return {
    hero: mergeSection(d.hero, remote.hero),
    collections:
      remote.collections?.length ? remote.collections : d.collections,
    curatedEssentials:
      remote.curatedEssentials?.length
        ? remote.curatedEssentials
        : d.curatedEssentials,
    worldOfAfari: mergeSection(d.worldOfAfari, remote.worldOfAfari),
    products: remote.products?.length ? remote.products : d.products,
  };
}

export function getStoreContentLocal(): StoreContentData {
  try {
    const doc = readJsonFile<Partial<StoreContentDocument>>("store.json");
    return mergeStoreData(doc.data);
  } catch {
    return STORE_CONTENT_DEFAULTS;
  }
}

export const getStoreContent = cache(async (): Promise<StoreContentData> => {
  const doc = await fetchCmsJson<StoreContentDocument>("/content/store");
  if (doc?.data) return mergeStoreData(doc.data);
  return getStoreContentLocal();
});

export function saveStoreContentLocal(
  data: StoreContentData,
): StoreContentDocument {
  const doc: StoreContentDocument = {
    key: "main",
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("store.json", doc);
  return doc;
}

export async function getStoreProduct(
  slug: string,
): Promise<Product | undefined> {
  const { products } = await getStoreContent();
  return products.find((p) => p.slug === slug);
}

export async function getStoreRelatedProducts(
  slugs: string[],
): Promise<Product[]> {
  const { products } = await getStoreContent();
  return slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => !!p);
}
