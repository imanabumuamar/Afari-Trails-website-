import { cache } from "react";
import { JOURNAL_CONTENT_DEFAULTS } from "@/lib/data/journal-defaults";
import { getApiBaseUrl } from "@/lib/api/backend";
import { readJsonFile, writeJsonFile } from "@/services/content/repository";
import type {
  JournalContentData,
  JournalContentDocument,
  JournalStoryRecord,
} from "@/types/journal-content";

function mergePage<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

function mergeStories(
  defaults: JournalStoryRecord[],
  remote: JournalStoryRecord[] | undefined,
): JournalStoryRecord[] {
  if (!remote || remote.length === 0) return defaults;

  const remoteBySlug = new Map(remote.map((s) => [s.slug, s]));
  const merged = defaults.map((story) => {
    const patch = remoteBySlug.get(story.slug);
    if (!patch) return story;
    return {
      ...story,
      ...patch,
      published: patch.published !== false,
    };
  });

  for (const story of remote) {
    if (!defaults.some((d) => d.slug === story.slug)) {
      merged.push({
        ...story,
        published: story.published !== false,
      });
    }
  }

  return merged;
}

function mergeJournalData(
  remote?: Partial<JournalContentData> | null,
): JournalContentData {
  const defaults = JOURNAL_CONTENT_DEFAULTS;
  if (!remote) return defaults;

  const page = (remote.page ?? {}) as Partial<JournalContentData["page"]>;
  return {
    page: {
      hero: mergePage(defaults.page.hero, page.hero),
      newsletter: mergePage(defaults.page.newsletter, page.newsletter),
      categories:
        Array.isArray(page.categories) && page.categories.length > 0
          ? page.categories
          : defaults.page.categories,
    },
    stories: mergeStories(defaults.stories, remote.stories),
  };
}

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
    try {
      const res = await fetch(`${getApiBaseUrl()}/content/journal`, {
        next: { revalidate: 30 },
      });
      if (res.ok) {
        const doc = (await res.json()) as JournalContentDocument;
        return mergeJournalData(doc.data);
      }
    } catch {
      // API offline
    }
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
  getLatestStories,
  getPublishedStories,
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
