#!/usr/bin/env node
/**
 * Pushes frontend/content/*.json into MongoDB (overwrites CMS documents).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, "..");
const repoRoot = path.join(backendRoot, "..");

dotenv.config({ path: path.join(backendRoot, ".env") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI in backend/.env");
  process.exit(1);
}

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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function main() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("[sync] Connected to MongoDB");

  const {
    saveHomepageContent,
    saveVentureContent,
    saveExpeditionsContent,
    saveJournalContent,
    saveArchiveContent,
    saveAboutContent,
    saveStoreContent,
    saveSupportContent,
    saveConnectContent,
  } = await import("../src/services/content.service.js");

  const contentDir = path.join(repoRoot, "frontend/content");

  const homepagePath = path.join(contentDir, "homepage.json");
  if (fs.existsSync(homepagePath)) {
    const homepage = readJson(homepagePath);
    await saveHomepageContent({
      hero: homepage.hero,
      featureCards: homepage.featureCards,
      ourEssence: homepage.ourEssence,
    });
    console.log("[sync] homepage");
  }

  for (const slug of VENTURE_SLUGS) {
    const p = path.join(contentDir, "ventures", `${slug}.json`);
    if (!fs.existsSync(p)) continue;
    const doc = readJson(p);
    await saveVentureContent(slug, doc.data ?? doc);
    console.log(`[sync] venture:${slug}`);
  }

  for (const [file, saver, label] of [
    ["expeditions.json", saveExpeditionsContent, "expeditions"],
    ["journal.json", saveJournalContent, "journal"],
    ["archive.json", saveArchiveContent, "archive"],
    ["about.json", saveAboutContent, "about"],
    ["store.json", saveStoreContent, "store"],
    ["support.json", saveSupportContent, "support"],
    ["connect.json", saveConnectContent, "connect"],
  ]) {
    const p = path.join(contentDir, file);
    if (!fs.existsSync(p)) continue;
    const doc = readJson(p);
    await saver(doc.data ?? doc);
    console.log(`[sync] ${label}`);
  }

  await mongoose.disconnect();
  console.log("[sync] MongoDB content updated from JSON files.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
