import type { JournalStoryRecord } from "@/types/journal-content";

export type JournalStoryStatus = "published" | "hidden";

export const JOURNAL_STORY_STATUS_OPTIONS: {
  value: JournalStoryStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "published",
    label: "Published",
    description:
      "Visible on the journal page, homepage picks, and at /journal/[slug].",
  },
  {
    value: "hidden",
    label: "Hidden",
    description:
      "Removed from the public journal. Still editable here in admin.",
  },
];

export function getJournalStoryStatus(story: JournalStoryRecord): JournalStoryStatus {
  return story.published === false ? "hidden" : "published";
}

export function applyJournalStoryStatus(
  story: JournalStoryRecord,
  status: JournalStoryStatus,
): JournalStoryRecord {
  return { ...story, published: status === "published" };
}

export function journalStoryStatusLabel(status: JournalStoryStatus): string {
  return JOURNAL_STORY_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function isJournalStoryPublished(story: JournalStoryRecord): boolean {
  return getJournalStoryStatus(story) === "published";
}
