#!/usr/bin/env node
/**
 * Verifies local MongoDB CMS data and (optionally) the Express API.
 * Run from repo root: npm run doctor
 */
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, "backend/.env") });

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/afari-trails";
const apiBase = (
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api"
).replace(/\/$/, "");

const VENTURE_SLUGS = [
  "main",
  "eco-lodge",
  "conservation",
  "community",
  "agriculture",
  "hospitality",
  "partner",
  "connect",
];

const CMS_CHECKS = [
  { name: "HomepageContent", collection: "homepagecontents", query: { slug: "main" } },
  { name: "ExpeditionContent", collection: "expeditioncontents", query: { key: "main" } },
  { name: "JournalContent", collection: "journalcontents", query: { key: "main" } },
  { name: "ArchiveContent", collection: "archivecontents", query: { key: "main" } },
  { name: "AboutContent", collection: "aboutcontents", query: { key: "main" } },
  { name: "StoreContent", collection: "storecontents", query: { key: "main" } },
  { name: "SupportContent", collection: "supportcontents", query: { key: "main" } },
  { name: "ConnectContent", collection: "connectcontents", query: { key: "main" } },
];

async function countVentures(db) {
  const ventures = await db
    .collection("venturecontents")
    .find({ slug: { $in: VENTURE_SLUGS } })
    .project({ slug: 1 })
    .toArray();
  const found = new Set(ventures.map((v) => v.slug));
  const missing = VENTURE_SLUGS.filter((s) => !found.has(s));
  return { count: found.size, missing };
}

async function checkMongo() {
  let ok = true;
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  const db = mongoose.connection.db;

  const users = await db.collection("users").countDocuments({ role: "super_admin" });
  console.log(`[mongo] Connected: ${uri}`);
  console.log(`[mongo] Super admins: ${users}`);
  if (users < 1) {
    console.error("[mongo] No super_admin user — run: npm run db:seed");
    ok = false;
  }

  for (const { name, collection, query } of CMS_CHECKS) {
    const doc = await db.collection(collection).findOne(query);
    if (doc) {
      console.log(`[mongo] ${name}: ok`);
    } else {
      console.error(`[mongo] ${name}: missing — run: npm run db:seed`);
      ok = false;
    }
  }

  const { count, missing } = await countVentures(db);
  console.log(`[mongo] VentureContent: ${count}/${VENTURE_SLUGS.length} slugs`);
  if (missing.length) {
    console.error(`[mongo] Missing venture slugs: ${missing.join(", ")}`);
    ok = false;
  }

  await mongoose.disconnect();
  return ok;
}

async function checkApi() {
  try {
    const health = await fetch(`${apiBase}/health`, { signal: AbortSignal.timeout(3000) });
    if (!health.ok) {
      console.warn(`[api] Health returned ${health.status} (is backend running?)`);
      return null;
    }
    const body = await health.json();
    console.log(`[api] ${apiBase}/health -> ${body.status}, database: ${body.database}`);
    if (body.database !== "connected") {
      console.warn("[api] API reports database disconnected");
      return false;
    }

    const paths = [
      "content/homepage",
      "content/expeditions",
      "content/journal",
      "content/archive",
      "content/ventures/eco-lodge",
      "content/about",
      "content/store",
      "content/support",
      "content/connect",
    ];
    let ok = true;
    for (const p of paths) {
      const res = await fetch(`${apiBase}/${p}`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        console.log(`[api] GET /${p} -> ${res.status}`);
      } else {
        console.error(`[api] GET /${p} -> ${res.status}`);
        ok = false;
      }
    }
    return ok;
  } catch {
    console.warn("[api] Backend not reachable — start with: npm run dev:api");
    return null;
  }
}

async function main() {
  console.log("=== Afari Trails stack check ===\n");

  if (!process.env.MONGODB_URI) {
    console.warn("[env] backend/.env missing MONGODB_URI (using default local URI)");
  }

  let ok = true;
  try {
    ok = (await checkMongo()) && ok;
  } catch (err) {
    console.error("[mongo] Connection failed:", err.message);
    console.error("  Run: npm run db:up   then: npm run db:seed");
    process.exit(1);
  }

  const apiOk = await checkApi();
  if (apiOk === false) ok = false;

  console.log("");
  if (ok) {
    console.log("All checks passed.");
    process.exit(0);
  }
  console.error("Some checks failed.");
  process.exit(1);
}

main();
