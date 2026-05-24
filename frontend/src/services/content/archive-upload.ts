import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type {
  ArchiveContentData,
  ArchiveImageRecord,
} from "@/types/archive-content";
import {
  getArchiveContentLocal,
  saveArchiveContentLocal,
} from "@/services/content/archive";

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

type UploadTarget = {
  fieldPath: string;
  imageId?: string;
  collectionId?: string;
  momentId?: string;
};

export function updateArchiveImageField(
  target: UploadTarget,
  file: Buffer,
  mimeType: string,
): { src: string; data: ArchiveContentData } {
  const ext = imageExtension(mimeType);
  const filename = `${fieldPathToFilename(target.fieldPath)}.${ext}`;
  const content = getArchiveContentLocal();

  if (target.imageId) {
    const index = content.images.findIndex((img) => img.id === target.imageId);
    if (index < 0) throw new Error("Gallery image not found");

    const folder = path.join("public", "images", "archive", target.imageId);
    mkdirSync(folder, { recursive: true });
    writeFileSync(path.join(process.cwd(), folder, filename), file);

    const src = `/images/archive/${target.imageId}/${filename}`;
    const record = content.images[index];
    const updated = setNestedValue(
      record as unknown as Record<string, unknown>,
      target.fieldPath,
      src,
    ) as ArchiveImageRecord;

    const images = [...content.images];
    images[index] = updated;
    const next = { ...content, images };
    saveArchiveContentLocal(next);
    return { src, data: next };
  }

  if (target.collectionId) {
    const index = content.collections.findIndex(
      (c) => c.id === target.collectionId,
    );
    if (index < 0) throw new Error("Collection not found");

    const folder = path.join(
      "public",
      "images",
      "archive",
      "collections",
      target.collectionId,
    );
    mkdirSync(path.join(process.cwd(), folder), { recursive: true });
    writeFileSync(path.join(process.cwd(), folder, filename), file);

    const src = `/images/archive/collections/${target.collectionId}/${filename}`;
    const collections = [...content.collections];
    collections[index] = { ...collections[index], image: src };
    const next = { ...content, collections };
    saveArchiveContentLocal(next);
    return { src, data: next };
  }

  if (target.momentId) {
    const index = content.latestMoments.findIndex(
      (m) => m.id === target.momentId,
    );
    if (index < 0) throw new Error("Moment not found");

    const folder = path.join(
      "public",
      "images",
      "archive",
      "moments",
      target.momentId,
    );
    mkdirSync(path.join(process.cwd(), folder), { recursive: true });
    writeFileSync(path.join(process.cwd(), folder, filename), file);

    const src = `/images/archive/moments/${target.momentId}/${filename}`;
    const latestMoments = [...content.latestMoments];
    latestMoments[index] = { ...latestMoments[index], image: src };
    const next = { ...content, latestMoments };
    saveArchiveContentLocal(next);
    return { src, data: next };
  }

  const folder = path.join(process.cwd(), "public", "images", "archive", "page");
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, filename), file);

  const src = `/images/archive/page/${filename}`;
  const page = setNestedValue(
    content.page as unknown as Record<string, unknown>,
    target.fieldPath,
    src,
  ) as ArchiveContentData["page"];

  const next = { ...content, page };
  saveArchiveContentLocal(next);
  return { src, data: next };
}
