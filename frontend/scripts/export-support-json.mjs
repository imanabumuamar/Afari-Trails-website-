import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { register } = await import("tsx/esm/api");
register();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { SUPPORT_CONTENT_DEFAULTS } = await import(
  "../src/lib/data/support-defaults.ts"
);

const out = path.join(__dirname, "../content/support.json");
const doc = {
  key: "main",
  data: SUPPORT_CONTENT_DEFAULTS,
  updatedAt: new Date().toISOString(),
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(doc, null, 2)}\n`);
console.log("Wrote", out);
