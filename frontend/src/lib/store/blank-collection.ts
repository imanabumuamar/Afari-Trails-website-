import type { EditorialCollection } from "@/types/store-content";

export function createBlankStoreCollection(): EditorialCollection {
  return {
    slug: `collection-${Date.now()}`,
    title: "New Collection",
    description: "",
    image: "",
    icon: "giraffe",
    hidden: false,
  };
}

export function slugifyStoreCollectionSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
