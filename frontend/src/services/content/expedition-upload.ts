import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
  ExpeditionsContentDocument,
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
): { src: string; data: ExpeditionsContentData; doc: ExpeditionsContentDocument } {
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

    const src = `/images/expeditions/${expeditionId}/${filename}?v=${Date.now()}`;
    const expedition = content.expeditions[index];
    const updated = setNestedValue(
      expedition as unknown as Record<string, unknown>,
      fieldPath,
      src,
    ) as ExpeditionDetailRecord;

    const expeditions = [...content.expeditions];
    expeditions[index] = updated;
    const next: ExpeditionsContentData = { ...content, expeditions };
    const doc = saveExpeditionsContentLocal(next);
    return { src, data: next, doc };
  }

  if (fieldPath.startsWith("allPage.")) {
    const innerPath = fieldPath.slice("allPage.".length);
    const allDir = path.join(
      process.cwd(),
      "public",
      "images",
      "expeditions",
      "all",
    );
    mkdirSync(allDir, { recursive: true });
    writeFileSync(path.join(allDir, filename), file);

    const src = `/images/expeditions/all/${filename}?v=${Date.now()}`;
    const allPage = setNestedValue(
      content.allPage as unknown as Record<string, unknown>,
      innerPath,
      src,
    ) as ExpeditionsContentData["allPage"];

    const next: ExpeditionsContentData = { ...content, allPage };
    const doc = saveExpeditionsContentLocal(next);
    return { src, data: next, doc };
  }

  const pageDir = path.join(
    process.cwd(),
    "public",
    "images",
    "expeditions",
    "page",
  );
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(path.join(pageDir, filename), file);

  const src = `/images/expeditions/page/${filename}?v=${Date.now()}`;
  const page = setNestedValue(
    content.page as unknown as Record<string, unknown>,
    fieldPath,
    src,
  ) as ExpeditionsContentData["page"];

  const next: ExpeditionsContentData = { ...content, page };
  const doc = saveExpeditionsContentLocal(next);
  return { src, data: next, doc };
}
