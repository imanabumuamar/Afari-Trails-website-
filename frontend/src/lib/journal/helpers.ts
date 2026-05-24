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
