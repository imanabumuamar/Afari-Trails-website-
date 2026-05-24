import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { buildDefaultArchiveContent } from "../src/lib/data/archive-defaults";

const outDir = path.join(process.cwd(), "content");
mkdirSync(outDir, { recursive: true });

const doc = {
  key: "main",
  data: buildDefaultArchiveContent(),
  updatedAt: new Date().toISOString(),
};

writeFileSync(
  path.join(outDir, "archive.json"),
  `${JSON.stringify(doc, null, 2)}\n`,
  "utf-8",
);

console.log("Wrote content/archive.json");
