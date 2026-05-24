import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type {
  JournalContentData,
  JournalStoryRecord,
} from "@/types/journal-content";
import {
  getJournalContentLocal,
  saveJournalContentLocal,
} from "@/services/content/journal";

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export function updateJournalImageField(
  storySlug: string | undefined,
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): { src: string; data: JournalContentData } {
  const ext = imageExtension(mimeType);
  const filename = `${fieldPathToFilename(fieldPath)}.${ext}`;
  const content = getJournalContentLocal();

  if (storySlug) {
    const index = content.stories.findIndex((s) => s.slug === storySlug);
    if (index < 0) {
      throw new Error("Story not found");
    }

    const publicDir = path.join(
      process.cwd(),
      "public",
      "images",
      "journal",
      storySlug,
    );
    mkdirSync(publicDir, { recursive: true });
    writeFileSync(path.join(publicDir, filename), file);

    const src = `/images/journal/${storySlug}/${filename}`;
    const story = content.stories[index];
    const updated = setNestedValue(
      story as unknown as Record<string, unknown>,
      fieldPath,
      src,
    ) as JournalStoryRecord;

    const stories = [...content.stories];
    stories[index] = updated;
    const next: JournalContentData = { ...content, stories };
    saveJournalContentLocal(next);
    return { src, data: next };
  }

  const publicDir = path.join(
    process.cwd(),
    "public",
    "images",
    "journal",
    "page",
  );
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(path.join(publicDir, filename), file);

  const src = `/images/journal/page/${filename}`;
  const page = setNestedValue(
    content.page as unknown as Record<string, unknown>,
    fieldPath,
    src,
  ) as JournalContentData["page"];

  const next: JournalContentData = { ...content, page };
  saveJournalContentLocal(next);
  return { src, data: next };
}
