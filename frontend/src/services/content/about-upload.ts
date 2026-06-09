import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type { AboutContentData } from "@/types/about-content";
import {
  getAboutContentLocal,
  saveAboutContentLocal,
} from "@/services/content/about";

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export function updateAboutImageField(
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): { src: string; data: AboutContentData } {
  const ext = imageExtension(mimeType);
  const filename = `${fieldPathToFilename(fieldPath)}.${ext}`;
  const content = getAboutContentLocal();

  const publicDir = path.join(process.cwd(), "public", "images", "about");
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(path.join(publicDir, filename), file);

  const src = `/images/about/${filename}?v=${Date.now()}`;
  const data = setNestedValue(
    content as unknown as Record<string, unknown>,
    fieldPath,
    src,
  ) as AboutContentData;

  saveAboutContentLocal(data);
  return { src, data };
}
