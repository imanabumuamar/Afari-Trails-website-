import type { JournalStoryRecord } from "@/types/journal-content";

export function getPublishedStories(
  stories: JournalStoryRecord[],
): JournalStoryRecord[] {
  return stories.filter((s) => s.published !== false);
}

export function getFeaturedStory(
  stories: JournalStoryRecord[],
): JournalStoryRecord | undefined {
  return getPublishedStories(stories).find((s) => s.featured);
}

export function getFeaturedSideStories(
  stories: JournalStoryRecord[],
): JournalStoryRecord[] {
  return getPublishedStories(stories).filter((s) => s.featuredSide);
}

export function getLatestStories(
  stories: JournalStoryRecord[],
): JournalStoryRecord[] {
  return getPublishedStories(stories).filter(
    (s) => !s.featured && !s.featuredSide,
  );
}

export function resolveStoriesBySlugs(
  stories: JournalStoryRecord[],
  slugs: readonly string[],
): JournalStoryRecord[] {
  if (slugs.length === 0) return [];

  const bySlug = new Map(getPublishedStories(stories).map((s) => [s.slug, s]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((s): s is JournalStoryRecord => Boolean(s));
}

export function getLatestStoriesForGrid(
  stories: JournalStoryRecord[],
  latestStorySlugs: readonly string[],
): JournalStoryRecord[] {
  const curated = resolveStoriesBySlugs(stories, latestStorySlugs);
  if (curated.length > 0) return curated;
  return getLatestStories(stories);
}

export const HOMEPAGE_JOURNAL_STORY_LIMIT = 3;

export function getHomepageJournalStories(
  stories: JournalStoryRecord[],
  homepageStorySlugs: readonly string[],
): JournalStoryRecord[] {
  const curated = resolveStoriesBySlugs(
    stories,
    homepageStorySlugs.slice(0, HOMEPAGE_JOURNAL_STORY_LIMIT),
  );
  if (curated.length > 0) return curated;
  return getPublishedStories(stories).slice(0, HOMEPAGE_JOURNAL_STORY_LIMIT);
}
