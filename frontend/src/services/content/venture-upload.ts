import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import type { VentureSlug } from "@/lib/data/venture-defaults";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import {
  getVentureContentLocal,
  saveVentureContentLocal,
} from "@/services/content/ventures";

export function updateVentureImageField(
  slug: VentureSlug,
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): { src: string; data: Record<string, unknown> } {
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

  const src = `/images/ventures/${slug}/${filename}`;
  const current = getVentureContentLocal(slug);
  const nextData = setNestedValue(current, fieldPath, src);

  saveVentureContentLocal(slug, nextData);

  return { src, data: nextData };
}
