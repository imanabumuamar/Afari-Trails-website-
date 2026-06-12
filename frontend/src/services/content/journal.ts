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
    let localDoc: JournalContentDocument | null = null;
    try {
      localDoc = readJsonFile<JournalContentDocument>("journal.json");
    } catch {
      localDoc = null;
    }

    const local = localDoc
      ? mergeJournalData(localDoc.data)
      : JOURNAL_CONTENT_DEFAULTS;

    const doc = await fetchCmsJson<JournalContentDocument>("/content/journal");
    if (!doc?.data) return local;

    const remote = mergeJournalData(doc.data);
    if (!localDoc?.updatedAt) return remote;

    const localTime = new Date(localDoc.updatedAt).getTime();
    const remoteTime = new Date(doc.updatedAt ?? 0).getTime();
    return localTime >= remoteTime ? local : remote;
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
  const story = stories.find((s) => s.slug === slug);
  if (!story || story.published === false) return undefined;
  return story;
}

export async function getAllStorySlugs(): Promise<string[]> {
  const { stories } = await getJournalContent();
  return stories.filter((s) => s.published !== false).map((s) => s.slug);
}
