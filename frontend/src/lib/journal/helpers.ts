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

export function getStoriesForAllView(
  stories: JournalStoryRecord[],
  latestStorySlugs: readonly string[],
  excludeSlugs: readonly string[] = [],
): JournalStoryRecord[] {
  const exclude = new Set(excludeSlugs);
  const pool = getPublishedStories(stories).filter((s) => !exclude.has(s.slug));
  if (latestStorySlugs.length === 0) return pool;

  const curated = resolveStoriesBySlugs(stories, latestStorySlugs).filter(
    (s) => !exclude.has(s.slug),
  );
  const curatedSlugs = new Set(curated.map((s) => s.slug));
  const rest = pool.filter((s) => !curatedSlugs.has(s.slug));
  return [...curated, ...rest];
}

export function getLatestStoriesForGrid(
  stories: JournalStoryRecord[],
  latestStorySlugs: readonly string[],
): JournalStoryRecord[] {
  const featuredSlugs = getPublishedStories(stories)
    .filter((s) => s.featured || s.featuredSide)
    .map((s) => s.slug);
  return getStoriesForAllView(stories, latestStorySlugs, featuredSlugs);
}

export const HOMEPAGE_JOURNAL_STORY_LIMIT = 3;

/** Drop hidden or missing stories from a curated slug list (fixes ghost homepage picks). */
export function pruneStorySlugs(
  stories: JournalStoryRecord[],
  slugs: readonly string[],
  maxCount?: number,
): string[] {
  const publishedSlugs = new Set(
    getPublishedStories(stories).map((s) => s.slug),
  );
  const pruned = slugs.filter((slug) => publishedSlugs.has(slug));
  return maxCount !== undefined ? pruned.slice(0, maxCount) : pruned;
}

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
