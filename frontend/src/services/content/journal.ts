import { cache } from "react";
import { JOURNAL_CONTENT_DEFAULTS } from "@/lib/data/journal-defaults";
import { mergeJournalData } from "@/lib/journal/merge-journal-data";
import { fetchCmsJson } from "@/lib/api/fetch-content";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  JournalContentData,
  JournalContentDocument,
  JournalStoryRecord,
} from "@/types/journal-content";

export { mergeJournalData } from "@/lib/journal/merge-journal-data";

export function getJournalContentLocal(): JournalContentData {
  try {
    const doc = readJsonFile<Partial<JournalContentDocument>>("journal.json");
    return mergeJournalData(doc.data);
  } catch {
    return JOURNAL_CONTENT_DEFAULTS;
  }
}

export const getJournalContent = cache(
  async (): Promise<JournalContentData> => {
    const doc = await fetchCmsJson<JournalContentDocument>("/content/journal");
    if (doc?.data) return mergeJournalData(doc.data);
    return getJournalContentLocal();
  },
);

export function saveJournalContentLocal(
  data: JournalContentData,
): JournalContentDocument {
  const doc: JournalContentDocument = {
    key: "main",
    data,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("journal.json", doc);
  return doc;
}

export {
  getFeaturedSideStories,
  getFeaturedStory,
  getHomepageJournalStories,
  getLatestStories,
  getLatestStoriesForGrid,
  getPublishedStories,
  resolveStoriesBySlugs,
} from "@/lib/journal/helpers";

export async function getStoryBySlug(
  slug: string,
): Promise<JournalStoryRecord | undefined> {
  const { stories } = await getJournalContent();
  return stories.find((s) => s.slug === slug);
}

export async function getAllStorySlugs(): Promise<string[]> {
  const { stories } = await getJournalContent();
  return stories.map((s) => s.slug);
}
