import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type { StoreContentData } from "@/types/store-content";
import {
  getStoreContentLocal,
  saveStoreContentLocal,
} from "@/services/content/store";

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export function updateStoreImageField(
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): { src: string; data: StoreContentData } {
  const ext = imageExtension(mimeType);
  const filename = `${fieldPathToFilename(fieldPath)}.${ext}`;
  const content = getStoreContentLocal();

  const publicDir = path.join(process.cwd(), "public", "images", "store");
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(path.join(publicDir, filename), file);

  const src = `/images/store/${filename}`;
  const data = setNestedValue(
    content as unknown as Record<string, unknown>,
    fieldPath,
    src,
  ) as StoreContentData;

  saveStoreContentLocal(data);
  return { src, data };
}
