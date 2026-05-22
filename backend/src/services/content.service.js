import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_FILE = path.join(
  __dirname,
  "../../../frontend/content/homepage.json"
);

export function getHomepageContent() {
  const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveHomepageContent(data) {
  const next = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(CONTENT_FILE, `${JSON.stringify(next, null, 2)}\n`);
  return next;
}
