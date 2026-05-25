import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fieldPathToFilename, setNestedValue } from "@/lib/admin/venture-nested";
import type { ConnectContentData } from "@/types/connect-content";
import {
  getConnectContentLocal,
  saveConnectContentLocal,
} from "@/services/content/connect";

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export function updateConnectImageField(
  fieldPath: string,
  file: Buffer,
  mimeType: string,
): { src: string; data: ConnectContentData } {
  const ext = imageExtension(mimeType);
  const filename = `${fieldPathToFilename(fieldPath)}.${ext}`;
  const content = getConnectContentLocal();

  const publicDir = path.join(process.cwd(), "public", "images", "connect");
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(path.join(publicDir, filename), file);

  const src = `/images/connect/${filename}`;
  const data = setNestedValue(
    content as unknown as Record<string, unknown>,
    fieldPath,
    src,
  ) as ConnectContentData;

  saveConnectContentLocal(data);
  return { src, data };
}
