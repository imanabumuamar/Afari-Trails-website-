import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { register } = await import("tsx/esm/api");
register();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { generalConnectConfig } = await import(
  "../src/lib/data/connect-general.ts"
);
const { expeditionsConnectConfig } = await import(
  "../src/lib/data/connect-expeditions.ts"
);
const CONNECT_CONTENT_DEFAULTS = {
  contact: generalConnectConfig,
  expeditions: expeditionsConnectConfig,
};

const out = path.join(__dirname, "../content/connect.json");
const doc = {
  key: "main",
  data: CONNECT_CONTENT_DEFAULTS,
  updatedAt: new Date().toISOString(),
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(doc, null, 2)}\n`);
console.log("Wrote", out);
