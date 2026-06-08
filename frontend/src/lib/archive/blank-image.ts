import type { ArchiveImageRecord } from "@/types/archive-content";

export function createBlankArchiveImage(
  id: string,
  category = "wildlife",
): ArchiveImageRecord {
  return {
    id,
    title: "New photograph",
    location: "Zambia",
    photographer: "Afari Trails",
    caption: "",
    category,
    image:
      "https://images.unsplash.com/photo-1589552603490-efd4e1f2836b?w=1200&q=85",
    published: true,
  };
}
