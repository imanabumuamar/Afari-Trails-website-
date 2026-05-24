import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HomepageContent } from "../models/HomepageContent.model.js";
import { VentureContent } from "../models/VentureContent.model.js";
import { ExpeditionContent } from "../models/ExpeditionContent.model.js";
import { JournalContent } from "../models/JournalContent.model.js";
import { ArchiveContent } from "../models/ArchiveContent.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_HOMEPAGE_JSON = path.join(
  __dirname,
  "../../../frontend/content/homepage.json",
);

const DEFAULT_HOMEPAGE = {
  slug: "main",
  hero: {
    heading: "Every trail changes the person walking it.",
    subtext:
      "Curated expeditions. Meaningful ventures. Timeless safari-inspired living.",
    poster: {
      src: "https://images.unsplash.com/photo-1587595431973-c026f9778660?w=2400&q=85",
      alt: "Safari landscape at golden hour",
    },
    video: "/videos/hero.mp4",
    primaryCta: { label: "Explore Expeditions", href: "/expeditions" },
    secondaryCta: { label: "Discover Ventures", href: "/ventures" },
  },
  featureCards: {
    expeditions: {
      src: "/images/home-expeditions-featured.png",
      alt: "Lush gorge with a bridge spanning the valley and river below",
    },
    ventures: {
      src: "/images/home-ventures-featured.png",
      alt: "Saddle-billed storks walking through sunlit grassland",
    },
    store: {
      src: "/images/home-store-featured.png",
      alt: "Afari Trails safari cap with embroidered logo on stone in the savanna",
    },
  },
  ourEssence: {
    src: "/images/home-our-essence.png",
    alt: "Waterbuck standing between trees in sunlit African woodland",
  },
};

function toClient(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    hero: o.hero,
    featureCards: o.featureCards,
    ourEssence: o.ourEssence,
    updatedAt: (o.updatedAt ?? new Date()).toISOString(),
  };
}

function loadJsonFallback() {
  try {
    const raw = fs.readFileSync(FRONTEND_HOMEPAGE_JSON, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      ...DEFAULT_HOMEPAGE,
      updatedAt: new Date(0).toISOString(),
    };
  }
}

export async function getHomepageContent() {
  let doc = await HomepageContent.findOne({ slug: "main" });
  if (!doc) {
    const fallback = loadJsonFallback();
    doc = await HomepageContent.create({
      slug: "main",
      hero: fallback.hero ?? DEFAULT_HOMEPAGE.hero,
      featureCards: fallback.featureCards ?? DEFAULT_HOMEPAGE.featureCards,
      ourEssence: fallback.ourEssence ?? DEFAULT_HOMEPAGE.ourEssence,
      updatedAt: new Date(),
    });
  }
  return toClient(doc);
}

export async function saveHomepageContent(patch) {
  let doc = await HomepageContent.findOne({ slug: "main" });
  if (!doc) {
    doc = await HomepageContent.create({ ...DEFAULT_HOMEPAGE, slug: "main" });
  }

  if (patch.hero) {
    doc.hero = { ...doc.hero.toObject(), ...patch.hero };
  }
  if (patch.featureCards) {
    doc.featureCards = {
      expeditions: patch.featureCards.expeditions ?? doc.featureCards.expeditions,
      ventures: patch.featureCards.ventures ?? doc.featureCards.ventures,
      store: patch.featureCards.store ?? doc.featureCards.store,
    };
  }
  if (patch.ourEssence) {
    doc.ourEssence = patch.ourEssence;
  }

  doc.updatedAt = new Date();
  await doc.save();

  const client = toClient(doc);

  try {
    fs.mkdirSync(path.dirname(FRONTEND_HOMEPAGE_JSON), { recursive: true });
    fs.writeFileSync(
      FRONTEND_HOMEPAGE_JSON,
      `${JSON.stringify(client, null, 2)}\n`,
    );
  } catch {
    // Frontend JSON sync is best-effort for static fallbacks
  }

  return client;
}

const VENTURES_JSON_DIR = path.join(
  __dirname,
  "../../../frontend/content/ventures",
);

const VALID_VENTURE_SLUGS = new Set([
  "main",
  "eco-lodge",
  "conservation",
  "community",
  "agriculture",
  "hospitality",
  "partner",
  "connect",
]);

function loadVentureJsonFallback(slug) {
  try {
    const filePath = path.join(VENTURES_JSON_DIR, `${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.data ?? parsed;
  } catch {
    return null;
  }
}

function toVentureClient(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    slug: o.slug,
    data: o.data,
    updatedAt: (o.updatedAt ?? new Date()).toISOString(),
  };
}

export function isValidVentureSlug(slug) {
  return VALID_VENTURE_SLUGS.has(slug);
}

export async function listVentureSlugs() {
  const docs = await VentureContent.find({}).select("slug updatedAt").lean();
  const slugs = [...VALID_VENTURE_SLUGS];
  return slugs.map((slug) => {
    const doc = docs.find((d) => d.slug === slug);
    return {
      slug,
      updatedAt: doc?.updatedAt
        ? new Date(doc.updatedAt).toISOString()
        : null,
    };
  });
}

export async function getVentureContent(slug) {
  if (!isValidVentureSlug(slug)) {
    const err = new Error("Venture page not found");
    err.status = 404;
    throw err;
  }

  let doc = await VentureContent.findOne({ slug });
  if (!doc) {
    const fallback = loadVentureJsonFallback(slug);
    if (!fallback) {
      const err = new Error("Venture content not found");
      err.status = 404;
      throw err;
    }
    doc = await VentureContent.create({
      slug,
      data: fallback,
      updatedAt: new Date(),
    });
  }

  return toVentureClient(doc);
}

export async function saveVentureContent(slug, data) {
  if (!isValidVentureSlug(slug)) {
    const err = new Error("Venture page not found");
    err.status = 404;
    throw err;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const err = new Error("Invalid venture content");
    err.status = 400;
    throw err;
  }

  let doc = await VentureContent.findOne({ slug });
  if (!doc) {
    doc = new VentureContent({ slug, data });
  } else {
    doc.data = data;
  }
  doc.updatedAt = new Date();
  await doc.save();

  const client = toVentureClient(doc);

  try {
    fs.mkdirSync(VENTURES_JSON_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(VENTURES_JSON_DIR, `${slug}.json`),
      `${JSON.stringify(client, null, 2)}\n`,
    );
  } catch {
    // best-effort JSON sync
  }

  return client;
}

export async function seedVentureContent() {
  for (const slug of VALID_VENTURE_SLUGS) {
    const existing = await VentureContent.findOne({ slug });
    if (existing) continue;

    const fallback = loadVentureJsonFallback(slug);
    if (fallback) {
      await VentureContent.create({
        slug,
        data: fallback,
        updatedAt: new Date(),
      });
    }
  }
}

const EXPEDITIONS_JSON_PATH = path.join(
  __dirname,
  "../../../frontend/content/expeditions.json",
);

function loadExpeditionsJsonFallback() {
  try {
    const raw = fs.readFileSync(EXPEDITIONS_JSON_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.data ?? parsed;
  } catch {
    return null;
  }
}

function toExpeditionsClient(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    key: o.key ?? "main",
    data: o.data,
    updatedAt: (o.updatedAt ?? new Date()).toISOString(),
  };
}

export async function getExpeditionsContent() {
  let doc = await ExpeditionContent.findOne({ key: "main" });
  if (!doc) {
    const fallback = loadExpeditionsJsonFallback();
    if (!fallback) {
      const err = new Error("Expedition content not found");
      err.status = 404;
      throw err;
    }
    doc = await ExpeditionContent.create({
      key: "main",
      data: fallback,
      updatedAt: new Date(),
    });
  }
  return toExpeditionsClient(doc);
}

export async function saveExpeditionsContent(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const err = new Error("Invalid expedition content");
    err.status = 400;
    throw err;
  }

  if (!Array.isArray(data.expeditions)) {
    const err = new Error("expeditions must be an array");
    err.status = 400;
    throw err;
  }

  let doc = await ExpeditionContent.findOne({ key: "main" });
  if (!doc) {
    doc = new ExpeditionContent({ key: "main", data });
  } else {
    doc.data = data;
  }
  doc.updatedAt = new Date();
  await doc.save();

  const client = toExpeditionsClient(doc);

  try {
    fs.writeFileSync(
      EXPEDITIONS_JSON_PATH,
      `${JSON.stringify(client, null, 2)}\n`,
    );
  } catch {
    // best-effort JSON sync
  }

  return client;
}

export async function seedExpeditionContent() {
  const existing = await ExpeditionContent.findOne({ key: "main" });
  if (existing) return;

  const fallback = loadExpeditionsJsonFallback();
  if (fallback) {
    await ExpeditionContent.create({
      key: "main",
      data: fallback,
      updatedAt: new Date(),
    });
  }
}

const JOURNAL_JSON_PATH = path.join(
  __dirname,
  "../../../frontend/content/journal.json",
);

function loadJournalJsonFallback() {
  try {
    const raw = fs.readFileSync(JOURNAL_JSON_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.data ?? parsed;
  } catch {
    return null;
  }
}

function toJournalClient(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    key: o.key ?? "main",
    data: o.data,
    updatedAt: (o.updatedAt ?? new Date()).toISOString(),
  };
}

export async function getJournalContent() {
  let doc = await JournalContent.findOne({ key: "main" });
  if (!doc) {
    const fallback = loadJournalJsonFallback();
    if (!fallback) {
      const err = new Error("Journal content not found");
      err.status = 404;
      throw err;
    }
    doc = await JournalContent.create({
      key: "main",
      data: fallback,
      updatedAt: new Date(),
    });
  }
  return toJournalClient(doc);
}

export async function saveJournalContent(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const err = new Error("Invalid journal content");
    err.status = 400;
    throw err;
  }

  if (!Array.isArray(data.stories)) {
    const err = new Error("stories must be an array");
    err.status = 400;
    throw err;
  }

  let doc = await JournalContent.findOne({ key: "main" });
  if (!doc) {
    doc = new JournalContent({ key: "main", data });
  } else {
    doc.data = data;
  }
  doc.updatedAt = new Date();
  await doc.save();

  const client = toJournalClient(doc);

  try {
    fs.writeFileSync(
      JOURNAL_JSON_PATH,
      `${JSON.stringify(client, null, 2)}\n`,
    );
  } catch {
    // best-effort JSON sync
  }

  return client;
}

export async function seedJournalContent() {
  const existing = await JournalContent.findOne({ key: "main" });
  if (existing) return;

  const fallback = loadJournalJsonFallback();
  if (fallback) {
    await JournalContent.create({
      key: "main",
      data: fallback,
      updatedAt: new Date(),
    });
  }
}

const ARCHIVE_JSON_PATH = path.join(
  __dirname,
  "../../../frontend/content/archive.json",
);

function loadArchiveJsonFallback() {
  try {
    const raw = fs.readFileSync(ARCHIVE_JSON_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.data ?? parsed;
  } catch {
    return null;
  }
}

function toArchiveClient(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    key: o.key ?? "main",
    data: o.data,
    updatedAt: (o.updatedAt ?? new Date()).toISOString(),
  };
}

export async function getArchiveContent() {
  let doc = await ArchiveContent.findOne({ key: "main" });
  if (!doc) {
    const fallback = loadArchiveJsonFallback();
    if (!fallback) {
      const err = new Error("Archive content not found");
      err.status = 404;
      throw err;
    }
    doc = await ArchiveContent.create({
      key: "main",
      data: fallback,
      updatedAt: new Date(),
    });
  }
  return toArchiveClient(doc);
}

export async function saveArchiveContent(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const err = new Error("Invalid archive content");
    err.status = 400;
    throw err;
  }

  if (!Array.isArray(data.images)) {
    const err = new Error("images must be an array");
    err.status = 400;
    throw err;
  }

  let doc = await ArchiveContent.findOne({ key: "main" });
  if (!doc) {
    doc = new ArchiveContent({ key: "main", data });
  } else {
    doc.data = data;
  }
  doc.updatedAt = new Date();
  await doc.save();

  const client = toArchiveClient(doc);

  try {
    fs.writeFileSync(
      ARCHIVE_JSON_PATH,
      `${JSON.stringify(client, null, 2)}\n`,
    );
  } catch {
    // best-effort JSON sync
  }

  return client;
}

export async function seedArchiveContent() {
  const existing = await ArchiveContent.findOne({ key: "main" });
  if (existing) return;

  const fallback = loadArchiveJsonFallback();
  if (fallback) {
    await ArchiveContent.create({
      key: "main",
      data: fallback,
      updatedAt: new Date(),
    });
  }
}
