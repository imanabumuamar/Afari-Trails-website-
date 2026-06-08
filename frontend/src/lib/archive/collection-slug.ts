import type { ArchiveCollection } from "@/types/archive-content";

export function slugifyCollectionId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function createBlankArchiveCollection(): ArchiveCollection {
  return {
    id: `collection-${Date.now()}`,
    title: "New Collection",
    description: "",
    icon: "wildlife",
    image: "",
  };
}
