import { STORE_CONTENT_DEFAULTS } from "@/lib/data/store-defaults";
import { normalizeNewArrivals } from "@/lib/store/new-arrivals";
import { normalizeProducts } from "@/lib/store/product-options";
import type { StoreContentData } from "@/types/store-content";

function mergeSection<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

/** Client-safe merge — no fs or server-only imports. */
export function mergeStoreContentData(
  remote?: Partial<StoreContentData> | null,
): StoreContentData {
  const d: StoreContentData = STORE_CONTENT_DEFAULTS;
  if (!remote) return d;

  return {
    pageMode: remote.pageMode === "live" ? "live" : "coming-soon",
    hero: mergeSection(d.hero, remote.hero),
    collections: remote.collections?.length
      ? remote.collections.map((col) => ({
          ...col,
          hidden: col.hidden === true,
        }))
      : d.collections,
    newArrivals: normalizeNewArrivals(remote, d.newArrivals),
    worldOfAfari: mergeSection(d.worldOfAfari, remote.worldOfAfari),
    products: remote.products?.length
      ? normalizeProducts(remote.products)
      : d.products,
  };
}
