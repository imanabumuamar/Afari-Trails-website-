import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

const MAX_BYTES = 8 * 1024 * 1024;

function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export function saveArchiveSubmissionPhoto(
  buffer: Buffer,
  mimeType: string,
): { photoUrl: string; folderId: string } {
  if (!mimeType.startsWith("image/")) {
    throw new Error("File must be an image");
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be 8 MB or smaller");
  }

  const folderId = `${Date.now()}-${randomBytes(4).toString("hex")}`;
  const ext = imageExtension(mimeType);
  const relativeDir = path.join(
    "public",
    "images",
    "archive",
    "submissions",
    folderId,
  );
  const absoluteDir = path.join(process.cwd(), relativeDir);
  mkdirSync(absoluteDir, { recursive: true });
  writeFileSync(path.join(absoluteDir, `photo.${ext}`), buffer);

  return {
    folderId,
    photoUrl: `/images/archive/submissions/${folderId}/photo.${ext}`,
  };
}
