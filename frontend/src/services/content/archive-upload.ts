import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type {
  ArchiveContentData,
  ArchiveImageRecord,
} from "@/types/archive-content";
import { upsertSpotlightGalleryImage } from "@/lib/archive/spotlight-gallery";
import { saveArchiveContentLocal } from "@/services/content/archive";

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

/** Same filename on re-upload — bust browser cache so replacements show immediately. */
function versionedSrc(basePath: string, filename: string): string {
  return `${basePath}/${filename}?v=${Date.now()}`;
}

type UploadTarget = {
  fieldPath: string;
  imageId?: string;
  collectionId?: string;
};

export function updateArchiveImageField(
  base: ArchiveContentData,
  target: UploadTarget,
  file: Buffer,
  mimeType: string,
): { src: string; data: ArchiveContentData } {
  const ext = imageExtension(mimeType);
  const filename = `${fieldPathToFilename(target.fieldPath)}.${ext}`;
  const content = base;

  if (target.imageId) {
    const index = content.images.findIndex((img) => img.id === target.imageId);
    if (index < 0) throw new Error("Gallery image not found");

    const folder = path.join("public", "images", "archive", target.imageId);
    mkdirSync(path.join(process.cwd(), folder), { recursive: true });
    writeFileSync(path.join(process.cwd(), folder, filename), file);

    const src = versionedSrc(`/images/archive/${target.imageId}`, filename);
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

    const src = versionedSrc(
      `/images/archive/collections/${target.collectionId}`,
      filename,
    );
    const collections = [...content.collections];
    collections[index] = setNestedValue(
      collections[index] as unknown as Record<string, unknown>,
      target.fieldPath,
      src,
    ) as (typeof collections)[number];
    const next = { ...content, collections };
    saveArchiveContentLocal(next);
    return { src, data: next };
  }

  const folder = path.join(process.cwd(), "public", "images", "archive", "page");
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, filename), file);

  const src = versionedSrc("/images/archive/page", filename);
  const page = setNestedValue(
    content.page as unknown as Record<string, unknown>,
    target.fieldPath,
    src,
  ) as ArchiveContentData["page"];

  let next: ArchiveContentData = { ...content, page };
  if (target.fieldPath === "afariLens.image") {
    next = upsertSpotlightGalleryImage(next, src);
  }
  saveArchiveContentLocal(next);
  return { src, data: next };
}
