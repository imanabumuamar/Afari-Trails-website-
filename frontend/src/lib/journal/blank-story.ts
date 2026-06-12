import type { JournalStoryRecord } from "@/types/journal-content";

export function createBlankStory(
  slug: string,
  title: string,
): JournalStoryRecord {
  return {
    slug,
    title,
    excerpt: "",
    body: "",
    category: "reflections",
    categoryLabel: "Reflections",
    readTime: "5 MIN READ",
    dateDisplay: "JAN 1, 2026",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
    published: false,
  };
}
