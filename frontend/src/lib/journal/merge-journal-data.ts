import { JOURNAL_CONTENT_DEFAULTS } from "@/lib/data/journal-defaults";
import type {
  JournalContentData,
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

  const defaultsBySlug = new Map(defaults.map((s) => [s.slug, s]));
  const merged: JournalStoryRecord[] = remote.map((story) => {
    const base = defaultsBySlug.get(story.slug);
    return {
      ...(base ?? {}),
      ...story,
      published: story.published !== false,
    };
  });

  for (const story of defaults) {
    if (!merged.some((s) => s.slug === story.slug)) {
      merged.push({
        ...story,
        published: story.published !== false,
      });
    }
  }

  return merged;
}

/** Client-safe merge of remote journal CMS data with defaults (no Node fs). */
export function mergeJournalData(
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
      latestInitialCount:
        typeof page.latestInitialCount === "number" &&
        page.latestInitialCount > 0
          ? page.latestInitialCount
          : defaults.page.latestInitialCount,
    },
    stories: mergeStories(defaults.stories, remote.stories),
    latestStorySlugs: Array.isArray(remote.latestStorySlugs)
      ? [...remote.latestStorySlugs]
      : defaults.latestStorySlugs,
    homepageStorySlugs: Array.isArray(remote.homepageStorySlugs)
      ? [...remote.homepageStorySlugs]
      : defaults.homepageStorySlugs,
  };
}
