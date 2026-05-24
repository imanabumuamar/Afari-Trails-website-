import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { buildDefaultJournalContent } from "../src/lib/data/journal-defaults";

const outDir = path.join(process.cwd(), "content");
mkdirSync(outDir, { recursive: true });

const doc = {
  key: "main",
  data: buildDefaultJournalContent(),
  updatedAt: new Date().toISOString(),
};

writeFileSync(
  path.join(outDir, "journal.json"),
  `${JSON.stringify(doc, null, 2)}\n`,
  "utf-8",
);

console.log("Wrote content/journal.json");
