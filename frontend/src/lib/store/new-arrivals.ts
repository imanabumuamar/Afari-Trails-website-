import type { CuratedEssential, Product, StoreContentData } from "@/types/store-content";

type LegacyStoreData = StoreContentData & {
  curatedEssentials?: CuratedEssential[];
};

export function normalizeNewArrivals(
  remote: Partial<LegacyStoreData> | null | undefined,
  defaults: string[],
): string[] {
  if (Array.isArray(remote?.newArrivals)) {
    return remote.newArrivals.filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    );
  }

  if (remote?.curatedEssentials?.length) {
    return remote.curatedEssentials
      .map((item) => item.slug)
      .filter((slug) => slug.length > 0);
  }

  return defaults;
}

export function resolveNewArrivalProducts(
  slugs: string[],
  products: Product[],
): Product[] {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((product): product is Product => !!product);
}
