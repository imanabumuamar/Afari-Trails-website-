export type {
  StoreCategory,
  GearType,
  CollectionIconType,
  StoreHero,
  EditorialCollection,
  CuratedEssential,
  WorldOfAfari,
  Product,
} from "@/types/store-content";

export { STORE_CONTENT_DEFAULTS } from "@/lib/data/store-defaults";

import { STORE_CONTENT_DEFAULTS } from "@/lib/data/store-defaults";
import type { Product } from "@/types/store-content";

/** Static nav — not part of CMS */
export const storeNav = [
  { id: "new-arrivals" as const, label: "New Arrivals" },
  { id: "all" as const, label: "Collections" },
  { id: "apparel" as const, label: "Apparel" },
  { id: "accessories" as const, label: "Accessories" },
  { id: "field-essentials" as const, label: "Field Essentials" },
];

export const storeHero = STORE_CONTENT_DEFAULTS.hero;
export const editorialCollections = STORE_CONTENT_DEFAULTS.collections;
export const curatedEssentials = STORE_CONTENT_DEFAULTS.curatedEssentials;
export const worldOfAfari = STORE_CONTENT_DEFAULTS.worldOfAfari;
export const products = STORE_CONTENT_DEFAULTS.products;

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slugs: string[]) {
  return slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => !!p);
}
