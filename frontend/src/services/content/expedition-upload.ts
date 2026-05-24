import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
} from "@/types/expeditions-content";
import {
  getExpeditionsContentLocal,
  saveExpeditionsContentLocal,
} from "@/services/content/expeditions";

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export function updateExpeditionsImageField(
  expeditionId: string | undefined,
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): { src: string; data: ExpeditionsContentData } {
  const ext = imageExtension(mimeType);
  const filename = `${fieldPathToFilename(fieldPath)}.${ext}`;
  const content = getExpeditionsContentLocal();

  if (expeditionId) {
    const index = content.expeditions.findIndex((e) => e.id === expeditionId);
    if (index < 0) {
      throw new Error("Expedition not found");
    }

    const publicDir = path.join(
      process.cwd(),
      "public",
      "images",
      "expeditions",
      expeditionId,
    );
    mkdirSync(publicDir, { recursive: true });
    writeFileSync(path.join(publicDir, filename), file);

    const src = `/images/expeditions/${expeditionId}/${filename}`;
    const expedition = content.expeditions[index];
    const updated = setNestedValue(
      expedition as unknown as Record<string, unknown>,
      fieldPath,
      src,
    ) as ExpeditionDetailRecord;

    const expeditions = [...content.expeditions];
    expeditions[index] = updated;
    const next: ExpeditionsContentData = { ...content, expeditions };
    saveExpeditionsContentLocal(next);
    return { src, data: next };
  }

  const publicDir = path.join(
    process.cwd(),
    "public",
    "images",
    "expeditions",
    "page",
  );
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(path.join(publicDir, filename), file);

  const src = `/images/expeditions/page/${filename}`;
  const page = setNestedValue(
    content.page as unknown as Record<string, unknown>,
    fieldPath,
    src,
  ) as ExpeditionsContentData["page"];

  const next: ExpeditionsContentData = { ...content, page };
  saveExpeditionsContentLocal(next);
  return { src, data: next };
}
