import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import type { VentureSlug } from "@/lib/data/venture-defaults";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import {
  getVentureContentLocal,
  saveVentureContentLocal,
} from "@/services/content/ventures";

/** Writes the image file to public/ and returns its src (no JSON write). */
export function writeVentureImageFile(
  slug: VentureSlug,
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): string {
  const ext =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : "jpg";

  const filename = `${fieldPathToFilename(fieldPath)}.${ext}`;
  const publicDir = path.join(process.cwd(), "public", "images", "ventures", slug);
  mkdirSync(publicDir, { recursive: true });

  const imagePath = path.join(publicDir, filename);
  writeFileSync(imagePath, file);

  // The filename stays the same on re-upload, so add a version query to bust
  // the browser cache — otherwise the new photo looks like it "didn't save".
  return `/images/ventures/${slug}/${filename}?v=${Date.now()}`;
}

export function updateVentureImageField(
  slug: VentureSlug,
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): { src: string; data: Record<string, unknown> } {
  const src = writeVentureImageFile(slug, fieldPath, file, mimeType);
  const current = getVentureContentLocal(slug);
  const nextData = setNestedValue(current, fieldPath, src);

  saveVentureContentLocal(slug, nextData);

  return { src, data: nextData };
}
