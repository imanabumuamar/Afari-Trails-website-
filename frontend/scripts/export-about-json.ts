import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ABOUT_CONTENT_DEFAULTS } from "../src/lib/data/about-defaults";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../content/about.json");

const doc = {
  key: "main",
  data: ABOUT_CONTENT_DEFAULTS,
  updatedAt: new Date().toISOString(),
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(doc, null, 2)}\n`);
console.log("Wrote", out);
