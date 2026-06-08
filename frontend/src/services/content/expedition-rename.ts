import { existsSync, renameSync } from "fs";
import path from "path";

export function renameExpeditionImageDir(
  oldId: string,
  newId: string,
): void {
  if (oldId === newId) return;

  const base = path.join(process.cwd(), "public", "images", "expeditions");
  const oldDir = path.join(base, oldId);
  const newDir = path.join(base, newId);

  if (!existsSync(oldDir)) return;
  if (existsSync(newDir)) {
    throw new Error(
      `Cannot rename images: folder for "${newId}" already exists.`,
    );
  }

  renameSync(oldDir, newDir);
}
