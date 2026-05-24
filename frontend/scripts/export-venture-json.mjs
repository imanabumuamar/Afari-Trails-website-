/**
 * Writes frontend/content/ventures/*.json from TypeScript defaults.
 * Run from frontend/: node scripts/export-venture-json.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Register tsx to load .ts defaults
const { register } = await import("tsx/esm/api");
register();

const { VENTURE_SLUGS, VENTURE_PAGE_DEFAULTS } = await import(
  "../src/lib/data/venture-defaults.ts"
);

const outDir = join(root, "content", "ventures");
mkdirSync(outDir, { recursive: true });

for (const slug of VENTURE_SLUGS) {
  const doc = {
    slug,
    data: VENTURE_PAGE_DEFAULTS[slug],
    updatedAt: new Date().toISOString(),
  };
  writeFileSync(join(outDir, `${slug}.json`), `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`Wrote ${slug}.json`);
}
