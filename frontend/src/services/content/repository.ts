import { readFileSync, writeFileSync } from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeJsonFile<T>(filename: string, data: T): T {
  const filePath = path.join(CONTENT_DIR, filename);
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  return data;
}
