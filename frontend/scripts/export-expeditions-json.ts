import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { buildDefaultExpeditionsContent } from "../src/lib/data/expedition-defaults";

const outDir = path.join(process.cwd(), "content");
mkdirSync(outDir, { recursive: true });

const doc = {
  key: "main",
  data: buildDefaultExpeditionsContent(),
  updatedAt: new Date().toISOString(),
};

writeFileSync(
  path.join(outDir, "expeditions.json"),
  `${JSON.stringify(doc, null, 2)}\n`,
  "utf-8",
);

console.log("Wrote content/expeditions.json");
