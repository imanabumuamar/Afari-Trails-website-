import { cache } from "react";
import { STORE_CONTENT_DEFAULTS } from "@/lib/data/store-defaults";
import { mergeStoreContentData } from "@/lib/store/merge-store-content";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  Product,
  StoreContentData,
  StoreContentDocument,
} from "@/types/store-content";

export { mergeStoreContentData } from "@/lib/store/merge-store-content";

export function getStoreContentLocal(): StoreContentData {
  try {
    const doc = readJsonFile<Partial<StoreContentDocument>>("store.json");
    return mergeStoreContentData(doc.data);
  } catch {
    return STORE_CONTENT_DEFAULTS;
  }
}

export const getStoreContent = cache(async (): Promise<StoreContentData> => {
  const doc = await fetchCmsJson<StoreContentDocument>("/content/store");
  if (doc?.data) return mergeStoreContentData(doc.data);
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
